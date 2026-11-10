/**
 * GitHub 镜像代理 —— Cloudflare Worker（ES Module 格式）
 *
 * 部署入口：见 wrangler.toml 中的 main 字段
 * 本地校验：npx wrangler deploy --dry-run
 *
 * 路由约定：
 *   /index.html、/      -> 落地页（仓库根目录的 index.html）
 *   /api/xxx            -> https://api.github.com/xxx
 *   /raw/xxx            -> https://raw.githubusercontent.com/xxx
 *   *.css|js|img|font   -> https://github.com/xxx
 *   其它                -> https://github.com/xxx（HTML 内容会重写为代理链接）
 */
import landingPage from "../index.html";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const ASSET_PATTERN = /\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/i;
const NO_BODY_METHODS = new Set(["GET", "HEAD"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 落地页
    if (path === "/" || path === "/index.html") {
      return new Response(landingPage, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", ...CORS_HEADERS },
      });
    }

    // 计算上游地址与内容类型
    let target;
    let isHtml = false;

    if (path.startsWith("/api/")) {
      target = `https://api.github.com${path.slice("/api".length)}${url.search}`;
    } else if (path.startsWith("/raw/")) {
      target = `https://raw.githubusercontent.com${path.slice("/raw".length)}${url.search}`;
    } else if (ASSET_PATTERN.test(path)) {
      target = `https://github.com${path}${url.search}`;
    } else {
      target = `https://github.com${path}${url.search}`;
      isHtml = true;
    }

    // 组装转发请求头
    const headers = new Headers(request.headers);
    headers.delete("host");
    // 转发回去的 Accept-Encoding 会让上游返回压缩内容，改写正文时容易出现编码不一致
    headers.delete("accept-encoding");

    if (path.startsWith("/api/")) {
      headers.set("Accept", "application/vnd.github.v3+json");
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "ghp-github-mirror");
      }
      if (env && env.GITHUB_TOKEN) {
        headers.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      }
    }

    const init = {
      method: request.method,
      headers,
      redirect: "follow",
    };
    if (!NO_BODY_METHODS.has(request.method)) {
      init.body = request.body;
    }

    try {
      const upstream = await fetch(target, init);
      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set("Access-Control-Allow-Origin", "*");

      // HTML 页面：把 GitHub 链接改写为代理链接
      const contentType = upstream.headers.get("Content-Type") || "";
      if (isHtml && contentType.includes("text/html")) {
        const body = rewriteGitHubLinks(await upstream.text(), url.origin);
        // 正文已变化，编码相关头必须去掉，否则客户端解析会出错
        responseHeaders.delete("Content-Length");
        responseHeaders.delete("Content-Encoding");
        responseHeaders.set("Content-Type", "text/html; charset=utf-8");

        return new Response(body, {
          status: upstream.status,
          statusText: upstream.statusText,
          headers: responseHeaders,
        });
      }

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(`请求 GitHub 失败: ${err.message}`, {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS },
      });
    }
  },
};

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
