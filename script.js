document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSmoothScroll();
    initScrollState();
    initScrollAnimations();
    initContactForm();
});

function initNavigation() {
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    if (!navToggle || !navMenu) return;

    const closeMenu = () => {
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("active");
        document.body.classList.remove("nav-open");
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");
        navToggle.classList.toggle("active", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("nav-open", isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) closeMenu();
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

            window.scrollTo({ top, behavior: "smooth" });
            history.pushState(null, "", targetId);
        });
    });
}

function initScrollState() {
    const navLinks = [...document.querySelectorAll(".nav-link[href^='#']")];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (!navLinks.length || !sections.length) return;

    const updateActiveLink = () => {
        const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
        const marker = window.scrollY + navHeight + 90;
        let activeId = sections[0].id;

        sections.forEach((section) => {
            if (section.offsetTop <= marker) activeId = section.id;
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
        });
    };

    updateActiveLink();
    window.addEventListener("scroll", throttle(updateActiveLink, 100), { passive: true });
}

function initScrollAnimations() {
    const items = document.querySelectorAll(".section-header, .service-card, .step, .pricing-card, .client-card, .about-photo-wrap, .about-copy, .contact-copy, .contact-form");

    items.forEach((item) => item.classList.add("fade-in"));

    if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -80px 0px", threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
}

function initContactForm() {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        const action = form.getAttribute("action") || "";

        if (action.includes("YOUR_FORM_ID")) {
            event.preventDefault();
            const formData = new FormData(form);
            const subject = encodeURIComponent("Smart Core Solutions website inquiry");
            const body = encodeURIComponent(
                [
                    `Name: ${formData.get("name") || ""}`,
                    `Email: ${formData.get("email") || ""}`,
                    `Service: ${formData.get("service") || ""}`,
                    "",
                    formData.get("message") || ""
                ].join("\n")
            );

            window.location.href = `mailto:matthew@smartcoresolutions.com?subject=${subject}&body=${body}`;
            if (note) note.textContent = "Opening an email draft because the form service is not connected yet.";
            return;
        }

        event.preventDefault();
        const submitButton = form.querySelector("button[type='submit']");
        const originalText = submitButton?.textContent || "Send message";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch(action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" }
            });

            if (!response.ok) throw new Error("Form submission failed");

            form.reset();
            if (submitButton) submitButton.textContent = "Message sent";
            if (note) note.textContent = "Thanks. Matthew will follow up soon.";
        } catch (error) {
            if (submitButton) submitButton.textContent = "Try again";
            if (note) note.textContent = "Something went wrong. Email Matthew directly if the form keeps failing.";
            console.error(error);
        } finally {
            window.setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }, 3000);
        }
    });
}

function throttle(callback, delay) {
    let waiting = false;

    return (...args) => {
        if (waiting) return;

        callback(...args);
        waiting = true;
        window.setTimeout(() => {
            waiting = false;
        }, delay);
    };
}
