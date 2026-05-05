type CarouselRoot = HTMLElement;

const initCarousel = (root: CarouselRoot) => {
  const track = root.querySelector<HTMLOListElement>("[data-carousel-track]");
  const slides = Array.from(
    root.querySelectorAll<HTMLElement>(".carousel-slide"),
  );
  const prev = root.querySelector<HTMLButtonElement>("[data-carousel-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-carousel-next]");
  const dots = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-carousel-dot]"),
  );
  const autoplayMs = Number.parseInt(root.dataset.autoplay ?? "0", 10);

  if (!track || slides.length === 0) return;

  let activeIndex = 0;
  let autoplayTimer: number | undefined;
  let prefersReducedMotion = false;
  if (typeof window.matchMedia === "function") {
    prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }

  const updateDots = () => {
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-current", i === activeIndex ? "true" : "false");
    });
  };

  const apply = (target: number, animated = true) => {
    activeIndex = ((target % slides.length) + slides.length) % slides.length;
    track.style.transition =
      animated && !prefersReducedMotion
        ? ""
        : "none";
    track.style.transform = `translate3d(${-activeIndex * 100}%, 0, 0)`;
    updateDots();
  };

  prev?.addEventListener("click", () => apply(activeIndex - 1));
  next?.addEventListener("click", () => apply(activeIndex + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => apply(i)));

  // Pointer-based swipe (works for mouse, touch, pen)
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dragging = false;
  let gestureLocked: "x" | "y" | null = null;

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    gestureLocked = null;
    startX = e.clientX;
    startY = e.clientY;
    dx = 0;
    track.classList.add("is-dragging");
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const moveX = e.clientX - startX;
    const moveY = e.clientY - startY;

    if (gestureLocked === null) {
      if (Math.abs(moveX) < 6 && Math.abs(moveY) < 6) return;
      gestureLocked = Math.abs(moveX) > Math.abs(moveY) ? "x" : "y";
      if (gestureLocked === "x") {
        // Now we own the gesture; capture so subsequent events stay with us
        try {
          track.setPointerCapture?.(e.pointerId);
        } catch {
          /* noop */
        }
      } else {
        // Vertical scroll wins — release the swipe
        dragging = false;
        track.classList.remove("is-dragging");
        return;
      }
    }
    if (gestureLocked !== "x") return;

    dx = moveX;
    const widthPercent = (dx / root.offsetWidth) * 100;
    track.style.transform = `translate3d(${-activeIndex * 100 + widthPercent}%, 0, 0)`;
  };

  const onPointerEnd = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    try {
      track.releasePointerCapture?.(e.pointerId);
    } catch {
      /* noop */
    }
    if (gestureLocked !== "x") {
      apply(activeIndex);
      return;
    }
    const threshold = Math.max(40, root.offsetWidth / 6);
    if (dx > threshold) apply(activeIndex - 1);
    else if (dx < -threshold) apply(activeIndex + 1);
    else apply(activeIndex);
  };

  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", onPointerEnd);
  track.addEventListener("pointercancel", onPointerEnd);

  // Autoplay (paused on hover, focus, off-screen, reduced motion)
  if (autoplayMs > 0 && !prefersReducedMotion) {
    const start = () => {
      stop();
      autoplayTimer = window.setInterval(() => {
        apply(activeIndex + 1);
      }, autoplayMs);
    };
    const stop = () => {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = undefined;
      }
    };

    root.addEventListener("pointerenter", stop);
    root.addEventListener("pointerleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) start();
            else stop();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(root);
    } else {
      start();
    }
  }

  apply(0, false);
};

document
  .querySelectorAll<CarouselRoot>("[data-carousel]")
  .forEach(initCarousel);
