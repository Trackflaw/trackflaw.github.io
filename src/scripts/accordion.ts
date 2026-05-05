document.querySelectorAll<HTMLElement>("[data-accordion]").forEach((acc) => {
  const items = acc.querySelectorAll<HTMLElement>("[data-accordion-item]");
  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>(
      "[data-accordion-trigger]",
    );
    const panel = item.querySelector<HTMLElement>("[data-accordion-panel]");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      items.forEach((other) => {
        other.setAttribute("data-open", "false");
        const t = other.querySelector("[data-accordion-trigger]");
        t?.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.setAttribute("data-open", "true");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
});
