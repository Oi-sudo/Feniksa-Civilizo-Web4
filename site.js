const navItems = [
  ["home", "首页", "Portalo", "index.html"],
  ["about", "关于发起人", "Pri la Iniciatinto", "pages/about.html"],
  ["vow", "愿力不老", "La Voto Ne Maljuniĝas", "pages/vow.html"],
  ["libro", "凤凰文明书", "Libro de Feniksa Civilizacio", "pages/libro.html"],
  ["manifesto", "宣言", "Manifesto", "pages/manifesto.html"],
  ["contact", "联系方式", "Kontakto", "pages/contact.html"],
  ["museum", "数字博物馆", "Cifereca Muzeo", "museum/index.html"],
  ["songs", "世界语歌曲", "Esperantaj Kantoj", "songs/index.html"],
  ["videos", "有声影像", "Filmetoj kun sono", "videos/index.html"]
];

const cards = [
  ["about", "关于发起人", "Pri la Iniciatinto", "介绍凤凰文明 Web4 的缘起、发愿与守护边界。", "Pri la origino, voto kaj gardataj limoj de Feniksa Civilizacio Web4."],
  ["vow", "愿力不老", "La Voto Ne Maljuniĝas", "生命故事的起点：愿天下老人，临终不孤独。", "La vivrakonta komenco: ke maljunuloj ne estu solecaj ĉe la fino de vivo."],
  ["libro", "凤凰文明书", "Libro de Feniksa Civilizacio", "文明与觉醒、语言、思想、行动、重生的双语经卷。", "Dulingva libro pri civilizacio, vekiĝo, lingvo, penso, ago kaj renaskiĝo."],
  ["manifesto", "宣言", "Manifesto", "面向国际世界语者的共愿、共治、共建、共成宣言。", "Manifesto por internaciaj Esperantistoj: komuna voto, kunregado, kunkonstruado kaj kunplenumo."],
  ["contact", "联系方式", "Kontakto", "统一邮箱与后续共同维护入口。", "Unueca retpoŝto kaj enirejo por posta komuna prizorgado."],
  ["museum", "数字博物馆", "Cifereca Muzeo", "九馆文明地图、双语互动导览及十二集影像目录。", "Mapo de naŭ haloj, dulingva interaga gvidado kaj katalogo de dek du filmoj."]
];

function relativeHref(href) {
  const inPages = location.pathname.includes("/pages/");
  const inNewSection = location.pathname.includes("/songs/") || location.pathname.includes("/videos/");
  if (inNewSection) return "../" + href;
  if (inPages && ["museum/", "songs/", "videos/"].some(prefix => href.startsWith(prefix))) return "../" + href;
  if (inPages && href === "index.html") return "../index.html";
  if (inPages && href.startsWith("pages/")) return href.replace("pages/", "");
  return href;
}

function renderNav() {
  const current = document.body.dataset.page;
  const nav = document.querySelector("#site-nav");
  if (!nav) return;
  nav.innerHTML = navItems.map(([key, zh, eo, href]) => {
    const active = key === current ? ' aria-current="page"' : "";
    return `<a href="${relativeHref(href)}"${active}><span class="nav-zh">${zh}</span><span class="nav-slash">/</span><small>${eo}</small></a>`;
  }).join("");
}

function renderPortalCards() {
  const portal = document.querySelector("#portal");
  if (!portal) return;
  portal.innerHTML = cards.map(([key, zh, eo, text, eoText]) => {
    const item = navItems.find(([navKey]) => navKey === key);
    return `<a class="page-card" href="${relativeHref(item[3])}">
      <span>${eo}</span>
      <h3>${zh}</h3>
      <p>${text}</p>
      <p class="eo">${eoText}</p>
    </a>`;
  }).join("");
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

renderNav();
renderPortalCards();
setupMenu();
