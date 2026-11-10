var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/landing.js
var landing_default = `<!DOCTYPE html>\r
<html lang="zh-CN">\r
<head>\r
  <meta charset="UTF-8">\r
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
  <title>GitHub\u955C\u50CF\u4EE3\u7406</title>\r
  <style>\r
    body {\r
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\r
      line-height: 1.6;\r
      color: #24292e;\r
      max-width: 800px;\r
      margin: 0 auto;\r
      padding: 20px;\r
    }\r
    .container {\r
      background-color: #f6f8fa;\r
      border-radius: 6px;\r
      padding: 24px;\r
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);\r
    }\r
    h1 {\r
      font-size: 24px;\r
      border-bottom: 1px solid #eaecef;\r
      padding-bottom: 10px;\r
      margin-top: 0;\r
    }\r
    .search-form {\r
      margin: 20px 0;\r
    }\r
    .search-input {\r
      width: 70%;\r
      padding: 8px 12px;\r
      font-size: 14px;\r
      border: 1px solid #e1e4e8;\r
      border-radius: 6px;\r
    }\r
    .search-button {\r
      background-color: #2ea44f;\r
      color: white;\r
      border: none;\r
      padding: 8px 16px;\r
      font-size: 14px;\r
      border-radius: 6px;\r
      margin-left: 10px;\r
      cursor: pointer;\r
    }\r
    .search-button:hover {\r
      background-color: #2c974b;\r
    }\r
    .example {\r
      background: #fff;\r
      border: 1px solid #e1e4e8;\r
      border-radius: 6px;\r
      padding: 16px;\r
      margin: 20px 0;\r
    }\r
    .example h3 {\r
      margin-top: 0;\r
      font-size: 16px;\r
    }\r
    footer {\r
      margin-top: 30px;\r
      text-align: center;\r
      font-size: 12px;\r
      color: #6a737d;\r
    }\r
  </style>\r
</head>\r
<body>\r
  <div class="container">\r
    <h1>GitHub\u955C\u50CF\u4EE3\u7406</h1>\r
    \r
    <div class="search-form">\r
      <input \r
        type="text" \r
        id="github-url" \r
        class="search-input" \r
        placeholder="\u8F93\u5165GitHub URL (\u4F8B\u5982: https://github.com/microsoft/vscode)" \r
      />\r
      <button class="search-button" onclick="convertUrl()">\u8F6C\u6362\u5E76\u8BBF\u95EE</button>\r
    </div>\r
    \r
    <div class="example">\r
      <h3>\u4F7F\u7528\u793A\u4F8B:</h3>\r
      <p>1. \u8BBF\u95EEGitHub\u4ED3\u5E93\u9875\u9762:</p>\r
      <ul>\r
        <li>\u539F\u59CB: <code>https://github.com/\u7528\u6237\u540D/\u4ED3\u5E93\u540D</code></li>\r
        <li>\u4EE3\u7406: <code>https://[\u672C\u7AD9\u57DF\u540D]/\u7528\u6237\u540D/\u4ED3\u5E93\u540D</code></li>\r
      </ul>\r
      \r
      <p>2. \u8BBF\u95EEGitHub API:</p>\r
      <ul>\r
        <li>\u539F\u59CB: <code>https://api.github.com/repos/\u7528\u6237\u540D/\u4ED3\u5E93\u540D</code></li>\r
        <li>\u4EE3\u7406: <code>https://[\u672C\u7AD9\u57DF\u540D]/api/repos/\u7528\u6237\u540D/\u4ED3\u5E93\u540D</code></li>\r
      </ul>\r
      \r
      <p>3. \u8BBF\u95EERaw\u5185\u5BB9:</p>\r
      <ul>\r
        <li>\u539F\u59CB: <code>https://raw.githubusercontent.com/\u7528\u6237\u540D/\u4ED3\u5E93\u540D/\u5206\u652F/\u6587\u4EF6\u8DEF\u5F84</code></li>\r
        <li>\u4EE3\u7406: <code>https://[\u672C\u7AD9\u57DF\u540D]/raw/\u7528\u6237\u540D/\u4ED3\u5E93\u540D/\u5206\u652F/\u6587\u4EF6\u8DEF\u5F84</code></li>\r
      </ul>\r
    </div>\r
  </div>\r
  \r
  <footer>\r
    <p>\u6B64\u5DE5\u5177\u4EC5\u4F9B\u5B66\u4E60\u548C\u7814\u7A76\u4F7F\u7528\uFF0C\u8BF7\u9075\u5B88\u76F8\u5173\u6CD5\u5F8B\u6CD5\u89C4</p>\r
  </footer>\r
\r
  <script>\r
    // \u83B7\u53D6\u5F53\u524D\u7F51\u7AD9\u7684\u57DF\u540D\r
    const currentOrigin = window.location.origin;\r
    \r
    function convertUrl() {\r
      const inputUrl = document.getElementById('github-url').value.trim();\r
      \r
      if (!inputUrl) {\r
        alert('\u8BF7\u8F93\u5165GitHub URL');\r
        return;\r
      }\r
      \r
      try {\r
        const url = new URL(inputUrl);\r
        let convertedUrl = '';\r
        \r
        if (url.hostname === 'github.com') {\r
          convertedUrl = \`\${currentOrigin}\${url.pathname}\${url.search}\${url.hash}\`;\r
        } else if (url.hostname === 'api.github.com') {\r
          convertedUrl = \`\${currentOrigin}/api\${url.pathname}\${url.search}\${url.hash}\`;\r
        } else if (url.hostname === 'raw.githubusercontent.com') {\r
          convertedUrl = \`\${currentOrigin}/raw\${url.pathname}\${url.search}\${url.hash}\`;\r
        } else {\r
          alert('\u4E0D\u652F\u6301\u7684URL\u683C\u5F0F\uFF0C\u8BF7\u8F93\u5165GitHub\u3001GitHub API\u6216Raw URL');\r
          return;\r
        }\r
        \r
        window.location.href = convertedUrl;\r
      } catch (e) {\r
        alert('URL\u683C\u5F0F\u9519\u8BEF\uFF0C\u8BF7\u8F93\u5165\u5B8C\u6574\u7684URL\uFF0C\u5305\u62EChttps://');\r
      }\r
    }\r
    \r
    // \u56DE\u8F66\u952E\u63D0\u4EA4\r
    document.getElementById('github-url').addEventListener('keypress', function(e) {\r
      if (e.key === 'Enter') {\r
        convertUrl();\r
      }\r
    });\r
  <\/script>\r
</body>\r
</html>`;

// src/index.js
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};
var ASSET_PATTERN = /\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot)$/i;
var NO_BODY_METHODS = /* @__PURE__ */ new Set(["GET", "HEAD"]);
var DROP_REQUEST_HEADERS = [
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
  "x-real-ip"
];
var DROP_RESPONSE_HEADERS = ["connection", "keep-alive", "transfer-encoding", "upgrade"];
var src_default = {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (err) {
      const detail = err && err.stack ? err.stack : String(err);
      return new Response(`Worker \u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519\uFF1A
${detail}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS }
      });
    }
  }
};
async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (path === "/" || path === "/index.html") {
    const page = typeof landing_default === "string" ? landing_default : String(landing_default || "");
    return new Response(page, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", ...CORS_HEADERS }
    });
  }
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
  const headers = new Headers();
  for (const [key, value] of request.headers) {
    if (DROP_REQUEST_HEADERS.includes(key.toLowerCase())) continue;
    headers.set(key, value);
  }
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
  const contentType = upstream.headers.get("Content-Type") || "";
  if (isHtml && contentType.includes("text/html")) {
    const body = rewriteGitHubLinks(await upstream.text(), url.origin);
    responseHeaders.delete("Content-Length");
    responseHeaders.delete("Content-Encoding");
    responseHeaders.set("Content-Type", "text/html; charset=utf-8");
    return new Response(body, { status: safeStatus(upstream.status), headers: responseHeaders });
  }
  const noBody = upstream.status === 204 || upstream.status === 304;
  return new Response(noBody ? null : upstream.body, {
    status: safeStatus(upstream.status),
    headers: responseHeaders
  });
}
__name(handle, "handle");
function safeStatus(status) {
  return status >= 200 && status <= 599 ? status : 200;
}
__name(safeStatus, "safeStatus");
function rewriteGitHubLinks(html, origin) {
  return html.replace(/https:\/\/api\.github\.com\//g, `${origin}/api/`).replace(/https:\/\/raw\.githubusercontent\.com\//g, `${origin}/raw/`).replace(/https:\/\/github\.com\//g, `${origin}/`).replace(/href="\/([^"]*)"/g, `href="${origin}/$1"`).replace(/src="\/([^"]*)"/g, `src="${origin}/$1"`);
}
__name(rewriteGitHubLinks, "rewriteGitHubLinks");

// ../../AppData/Local/Temp/wrangler-cli/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../AppData/Local/Temp/wrangler-cli/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-44yNrP/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../AppData/Local/Temp/wrangler-cli/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-44yNrP/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
