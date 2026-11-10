/**
 * GitHub 镜像代理 —— Cloudflare Worker（ES Module 格式）
 *
 * 部署入口：见 wrangler.toml 中的 main 字段
 * 本地校验：npx wrangler deploy --dry-run
 *
 * 路由约定：
 *   /index.html、/      -> 落地页（src/landing.js，由 index.html 生成）
 *   /api/xxx            -> https://api.github.com/xxx
 *   /raw/xxx            -> https://raw.githubusercontent.com/xxx
 *   *.css|js|img|font   -> https://github.com/xxx
 *   其它                -> https://github.com/xxx（HTML 内容会重写为代理链接）
 */
import landingPage from "./landing.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const ASSET_PATTERN = /\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/i;
const NO_BODY_METHODS = new Set(["GET", "HEAD"]);

// 逐跳头 / Cloudflare 内部头，转发给上游可能引发异常或环路检测
const DROP_REQUEST_HEADERS = [
  "host",
  "connection",
  "keep-alive",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "proxy-connection",
  "content-length",
  "cdn-loop",
  "cf-connecting-ip",
  "cf-connecting-ipv6",
  "cf-ipcountry",
  "cf-ray",
  "cf-visitor",
  "cf-worker",
  "cf-request-id",
  "x-forwarded-proto",
  "x-real-ip",
];

const DROP_RESPONSE_HEADERS = ["connection", "keep-alive", "transfer-encoding", "upgrade"];

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (err) {
      // 兜底：把真实异常暴露出来，避免线上只看到 Cloudflare 1101
      const detail = err && err.stack ? err.stack : String(err);
      return new Response(`Worker 处理请求时出错：\n${detail}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS },
      });
    }
  },
};

async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // 落地页
  if (path === "/" || path === "/index.html") {
    const page = typeof landingPage === "string" ? landingPage : String(landingPage || "");
    return new Response(page, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", ...CORS_HEADERS },
    });
  }

  // 计算上游地址
  let target;
  let isHtml = false;

  if (path.startsWith("/api/")) {
    target = `https://api.github.com${path.slice("/api".length)}${url.search}`;
  } else if (path.startsWith("/raw/")) {
    target = `https://raw.githubusercontent.com${path.slice("/raw".length)}${url.search}`;
  } else {
    target = `https://github.com${path}${url.search}`;
    isHtml = !ASSET_PATTERN.test(path);
  }

  // 组装转发请求头（逐跳头逐个丢弃，其余原样带上）
  const headers = new Headers();
  for (const [key, value] of request.headers) {
    if (DROP_REQUEST_HEADERS.includes(key.toLowerCase())) continue;
    headers.set(key, value);
  }
  // 固定拿未压缩正文，避免改写内容与原始编码信息冲突
  headers.set("Accept-Encoding", "identity");

  if (path.startsWith("/api/")) {
    headers.set("Accept", "application/vnd.github.v3+json");
    if (!headers.has("User-Agent")) headers.set("User-Agent", "ghp-github-mirror");
    if (env && env.GITHUB_TOKEN) headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
  }

  const init = { method: request.method, headers, redirect: "follow" };
  if (!NO_BODY_METHODS.has(request.method) && request.body) {
    init.body = request.body;
  }

  const upstream = await fetch(target, init);

  const responseHeaders = new Headers();
  for (const [key, value] of upstream.headers) {
    if (DROP_RESPONSE_HEADERS.includes(key.toLowerCase())) continue;
    responseHeaders.set(key, value);
  }
  responseHeaders.set("Access-Control-Allow-Origin", "*");

  // HTML 页面：把 GitHub 链接改写为代理链接
  const contentType = upstream.headers.get("Content-Type") || "";
  if (isHtml && contentType.includes("text/html")) {
    const body = rewriteGitHubLinks(await upstream.text(), url.origin);
    responseHeaders.delete("Content-Length");
    responseHeaders.delete("Content-Encoding");
    responseHeaders.set("Content-Type", "text/html; charset=utf-8");

    return new Response(body, { status: safeStatus(upstream.status), headers: responseHeaders });
  }

  // 204 / 304 不允许带正文
  const noBody = upstream.status === 204 || upstream.status === 304;
  return new Response(noBody ? null : upstream.body, {
    status: safeStatus(upstream.status),
    headers: responseHeaders,
  });
}

function safeStatus(status) {
  return status >= 200 && status <= 599 ? status : 200;
}

/**
 * 把 HTML 中的 GitHub 链接改写为当前代理域名
 * @param {string} html 原始 HTML
 * @param {string} origin 代理站点源地址，例如 https://ghp.example.workers.dev
 * @returns {string} 改写后的 HTML
 */
function rewriteGitHubLinks(html, origin) {
  return html
    .replace(/https:\/\/api\.github\.com\//g, `${origin}/api/`)
    .replace(/https:\/\/raw\.githubusercontent\.com\//g, `${origin}/raw/`)
    .replace(/https:\/\/github\.com\//g, `${origin}/`)
    .replace(/href="\/([^"]*)"/g, `href="${origin}/$1"`)
    .replace(/src="\/([^"]*)"/g, `src="${origin}/$1"`);
}
