export default {
  fetch(request) {
    return new Response("probe-ok " + new URL(request.url).pathname, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
};
