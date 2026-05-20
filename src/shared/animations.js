/* ─── FĒMME — shared animation controller ──────────────────────────────────── */
(function () {
    "use strict";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Blur-slide-up: IntersectionObserver on .observe-in ──────── */
    if (!reduced && "IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("animate-in");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll(".observe-in").forEach((el) => io.observe(el));
    } else {
        document.querySelectorAll(".observe-in").forEach((el) => {
            el.style.opacity = "1";
        });
    }

    /* ── Image entrances on .observe-image ───────────────────────── */
    if (!reduced && "IntersectionObserver" in window) {
        const imgIO = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("animate-image-in");
                    imgIO.unobserve(e.target);
                }
            });
        }, { threshold: 0.05 });
        document.querySelectorAll(".observe-image").forEach((el) => imgIO.observe(el));
    } else {
        document.querySelectorAll(".observe-image").forEach((el) => {
            el.style.opacity = "1";
        });
    }

    /* ── Line reveals on .observe-line ───────────────────────────── */
    if (!reduced && "IntersectionObserver" in window) {
        const lineIO = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("animate-line-reveal");
                    lineIO.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll(".observe-line").forEach((el) => lineIO.observe(el));
    }

    /* ── Number counters on .observe-counter ─────────────────────── */
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const dur = 1400;
        const t0 = performance.now();
        const isInt = Number.isInteger(target);
        (function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            const v = (1 - Math.pow(1 - p, 3)) * target;
            el.textContent = prefix + (isInt ? Math.round(v) : v.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        })(t0);
    }
    if (!reduced && "IntersectionObserver" in window) {
        const cIO = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    animateCounter(e.target);
                    cIO.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll(".observe-counter").forEach((el) => {
            const raw = el.textContent.replace(/[^0-9.]/g, "");
            if (!raw) return;
            el.dataset.target = raw;
            el.dataset.suffix = el.textContent.replace(/[0-9.]/g, "").trim();
            el.textContent = "0";
            cIO.observe(el);
        });
    }

    /* ── Page cross-fade on internal links ───────────────────────── */
    let transitioning = false;
    document.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http") || href.includes("{{")) return;
        a.addEventListener("click", (e) => {
            if (transitioning) { e.preventDefault(); return; }
            e.preventDefault();
            transitioning = true;
            document.body.style.opacity = "0";
            document.body.style.transition = "opacity 0.3s ease";
            setTimeout(() => { window.location.href = href; }, 300);
            setTimeout(() => { transitioning = false; }, 700);
        });
    });

    /* ── Touch scale feedback on all interactive elements ─────────── */
    document.querySelectorAll("button, a, [role='button']").forEach((el) => {
        el.addEventListener("touchstart", () => el.classList.add("scale-95"), { passive: true });
        el.addEventListener("touchend",   () => el.classList.remove("scale-95"), { passive: true });
    });

})();
