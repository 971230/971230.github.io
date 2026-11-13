// 仅在首页启用 zensical.org 同款黑洞背景动画。
// home.js 体积较大，因此只在本页动态加载，避免影响其他页面。
;(() => {
  const isHome =
    location.pathname === "/" ||
    location.pathname.endsWith("/index.html")

  if (!isHome) return

  document.body.classList.add("md-home")
  document.body.dataset.mdColorScheme = "slate"

  const hero = document.createElement("div")
  hero.className = "mdx-hero"
  hero.id = "hero"

  const container = document.querySelector(".md-container") || document.body
  container.insertBefore(hero, container.firstChild)

  const script = document.createElement("script")
  script.src = "/assets/js/home.js"
  script.async = false
  document.body.appendChild(script)
})()
