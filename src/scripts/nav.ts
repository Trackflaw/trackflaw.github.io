const nav = document.querySelector<HTMLElement>("[data-nav]");
const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
const menu = document.querySelector<HTMLElement>("[data-nav-menu]");

if (nav) {
  const onScroll = () => {
    if (window.scrollY > 24) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("overflow-hidden", isOpen);
  });

  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
    }),
  );
}
