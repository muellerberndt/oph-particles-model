// Pragma Research measurement for subdomain sites: Google Analytics, Google Ads and the X pixel, under one cookie choice.
// Visitors in the EEA, the UK and Switzerland start with everything off until they accept; elsewhere it runs unless declined.
(() => {
  if (window.__fpTags) return; window.__fpTags = true;
  const GA = "G-HLGH209WMG", AW = "AW-18551449316", X = "r90vy";
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };
  let saved = null;
  try { saved = localStorage.getItem("fp_consent"); } catch (e) {}
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "");
  const european = /^Europe\//.test(tz) || /^Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz);
  const on = { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" };
  const off = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" };
  gtag("consent", "default", on);
  gtag("consent", "default", Object.assign({ wait_for_update: 500, region: ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH"] }, off));
  if (saved) gtag("consent", "update", saved === "granted" ? on : off);
  gtag("js", new Date());
  gtag("config", GA, { cookie_domain: "floatingpragma.ai" });
  gtag("config", AW);
  const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA;
  document.head.appendChild(s);

  let xLoaded = false;
  function loadX() {
    if (xLoaded) return; xLoaded = true;
    !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
    },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
    a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
    twq("config", X);
  }
  if (saved === "granted" || (!saved && !european)) loadX();

  function choose(g) {
    try { localStorage.setItem("fp_consent", g); } catch (e) {}
    gtag("consent", "update", g === "granted" ? on : off);
    if (g === "granted") loadX();
  }
  function banner() {
    if (document.getElementById("fp-consent")) return;
    const bar = document.createElement("div");
    bar.id = "fp-consent"; bar.setAttribute("role", "dialog"); bar.setAttribute("aria-label", "Cookie choice");
    bar.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;max-width:560px;margin:0 auto;padding:12px 14px;" +
      "background:rgba(8,12,22,.96);color:#c5d0e6;border:1px solid #1f2c48;border-radius:10px;font:13px/1.4 system-ui,sans-serif;" +
      "display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:space-between";
    bar.innerHTML = '<span>This site uses cookies to count visits and measure ads. <a href="https://floatingpragma.ai/privacy/" style="color:#6fb1ff">privacy</a></span>' +
      '<span style="display:flex;gap:8px"><button data-c="granted">accept</button><button data-c="denied">decline</button></span>';
    bar.querySelectorAll("button").forEach((b) => {
      b.style.cssText = "background:rgba(20,30,52,.9);color:#eef2fb;border:1px solid #1f2c48;border-radius:8px;padding:5px 12px;font:inherit;cursor:pointer";
      b.addEventListener("click", () => { choose(b.dataset.c); bar.remove(); });
    });
    document.body.appendChild(bar);
  }
  // "Particles: go deeper click": the visitor leaves for the book, the papers, the derivations, the textbooks or the Notebook
  const DEEPER = /(^|\.)(philpapers\.org|oph-book\.floatingpragma\.ai|learn\.floatingpragma\.ai|notebooklm\.google\.com|notebook\.google\.com)$/;
  const DEEPER_GH = /^\/(FloatingPragma\/observer-patch-holography|muellerberndt\/oph-particles-model\/(blob|tree)\/main\/derivations)/;
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest && ev.target.closest("a[href]"); if (!a) return;
    let u; try { u = new URL(a.href, location.href); } catch (e) { return; }
    if (!(DEEPER.test(u.hostname) || (u.hostname === "github.com" && DEEPER_GH.test(u.pathname)))) return;
    gtag("event", "go_deeper", { link_url: u.href, transport_type: "beacon" });
    gtag("event", "conversion", { send_to: AW + "/53iDCKSmlLYdEOTNgo5F", transport_type: "beacon" });
  }, true);

  const ready = (f) => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", f) : f();
  if (!saved && european) ready(banner);
  addEventListener("hashchange", () => { if (location.hash === "#cookies") ready(banner); });
})();
