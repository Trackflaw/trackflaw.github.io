const cards = document.querySelectorAll<HTMLElement>("[data-spotlight]");

cards.forEach((card) => {
  const handle = (e: PointerEvent) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  card.addEventListener("pointermove", handle, { passive: true });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  });
});
