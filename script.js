class PortfolioEnhancer {
  constructor() {
    this.ROOT_MARGIN = "0px 0px -50px 0px";
    this.init();

    window.addEventListener("popstate", (event) => {
      const targetId = event.state?.targetId;
      if (targetId) {
        const target = document.querySelector(targetId);
        if (target) {
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 0;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  }

  init() {
    try {
      this.setupSmoothScrolling();
      this.setupProfileModal();
      this.setupMobileNavigation();
      this.setupScrollProgress();
      this.setupIntersectionObserver();
      this.setupContactForm();
      this.setupThemeToggle();
      this.setupCopyrightYear();
      this.setupScrollToTop();
      this.setupCertificateModal();
    } catch (error) {
      console.error("PortfolioEnhancer initialization failed:", error);
      this.showErrorMessage();
    }
  }

  showErrorMessage() {
    const msg = document.createElement("div");
    msg.textContent =
      "⚠️ Some features failed to load. Please refresh the page.";
    msg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #ffe5e5;
      color: #b30000;
      padding: 12px 16px;
      border: 1px solid #ffcccc;
      border-radius: 6px;
      z-index: 9999;
      font-family: sans-serif;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(msg);

    setTimeout(() => {
      if (msg.parentNode) {
        msg.parentNode.removeChild(msg);
      }
    }, 8000);
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 0;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
          history.pushState(
            { targetId },
            "Smooth Scroll Target",
            encodeURIComponent(targetId)
          );
        }
      });
    });
  }

  setupProfileModal() {
    const profilePic = document.querySelector(".profile-pic");
    if (!profilePic) return;

    profilePic.style.transition =
      "transform 0.4s cubic-bezier(.4,2,.6,1), box-shadow 0.3s";

    const toggleZoom = () => {
      profilePic.classList.toggle("zoomed");
      document.body.style.overflow = profilePic.classList.contains("zoomed")
        ? "hidden"
        : "";
    };

    profilePic.addEventListener("click", toggleZoom);
    profilePic.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleZoom();
      }
    });

    // Optional: Zoom out on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && profilePic.classList.contains("zoomed")) {
        toggleZoom();
      }
    });
  }
  setupMobileNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (!hamburger || !navLinks) return;

    // Ensure navLinks has an id for aria-controls
    if (!navLinks.id) {
      navLinks.id = "nav-links";
    }

    const toggleMenu = () => {
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!isExpanded));
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    };

    hamburger.setAttribute("aria-label", "Toggle navigation menu");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-controls", navLinks.id);
    hamburger.addEventListener("click", toggleMenu);

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        toggleMenu();
        hamburger.focus();
      }
    });
  }

  setupScrollProgress() {
    const updateScrollProgress = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${scrollProgress}%`
      );
    };

    let isScrolling;
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(updateScrollProgress, 100);
      },
      { passive: true }
    );

    updateScrollProgress();
  }

  setupIntersectionObserver() {
    const animateElements = document.querySelectorAll(
      ".card, .section h2, .about-content"
    );
    if (!animateElements.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: this.ROOT_MARGIN }
      );
      animateElements.forEach((el) => observer.observe(el));
    } else {
      animateElements.forEach((el) => el.classList.add("animate"));
    }
  }

  setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // Create status message element
    const statusDiv = document.createElement("div");
    statusDiv.id = "form-status";
    statusDiv.style.cssText = `
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      display: none;
      font-weight: 500;
    `;
    form.appendChild(statusDiv);

    const showStatus = (message, isError = false) => {
      statusDiv.textContent = message;
      statusDiv.style.display = "block";
      statusDiv.style.backgroundColor = isError ? "#fee" : "#efe";
      statusDiv.style.color = isError ? "#c33" : "#363";
      statusDiv.style.border = `1px solid ${isError ? "#fcc" : "#cfc"}`;

      // Auto-hide after 5 seconds
      setTimeout(() => {
        statusDiv.style.display = "none";
      }, 5000);
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || "Send Message";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Show loading state
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      statusDiv.style.display = "none";

      try {
        const formData = new FormData(form);

        // Ensure form-name is included for Netlify
        const formName = form.getAttribute("name") || "contact";
        formData.set("form-name", formName);

        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
        });
        if (response.ok) {
          form.reset();
          showStatus("Thank you! Your message has been sent successfully.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        showStatus(
          "Sorry, there was a problem sending your message. Please try again.",
          true
        );
      } finally {
        // Reset button state
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  setupThemeToggle() {
    const modeToggle = document.getElementById("theme-toggle");
    if (!modeToggle) return;

    const getPreferredTheme = () => {
      try {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "light" || storedTheme === "dark") {
          return storedTheme;
        }
        return window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
      } catch (error) {
        console.warn("localStorage not available, using default theme");
        return window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
      }
    };

    const setTheme = (theme) => {
      document.body.classList.toggle("light-mode", theme === "light");
      const icon = modeToggle.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-sun", "fa-moon");
        icon.classList.add(theme === "light" ? "fa-sun" : "fa-moon");
      }

      try {
        localStorage.setItem("theme", theme);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    };

    setTheme(getPreferredTheme());

    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: light)")
        .addEventListener("change", (e) => {
          try {
            if (!localStorage.getItem("theme")) {
              setTheme(e.matches ? "light" : "dark");
            }
          } catch (error) {
            setTheme(e.matches ? "light" : "dark");
          }
        });
    }

    modeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-mode");
      setTheme(isLight ? "dark" : "light");
    });
  }
  setupCertificateModal() {
    // Modal elements
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("certModalImg");
    const modalCaption = document.getElementById("certModalCaption");
    const modalClose = document.getElementById("certModalClose");
    if (!modal || !modalImg || !modalClose) return;

    // Open modal on certificate click
    document.querySelectorAll(".view-certificate").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        modalImg.src = this.getAttribute("data-img");
        modalCaption.textContent = this.getAttribute("data-caption") || "";
        modal.classList.add("show");
      });
    });

    // Close modal on X click
    modalClose.onclick = function () {
      modal.classList.remove("show");
      modalImg.src = "";
      modalCaption.textContent = "";
    };

    // Close modal on outside click
    modal.onclick = function (e) {
      if (e.target === modal) {
        modal.classList.remove("show");
        modalImg.src = "";
        modalCaption.textContent = "";
      }
    };

    // Close modal on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        modal.classList.remove("show");
        modalImg.src = "";
        modalCaption.textContent = "";
      }
    });
  }
  setupCopyrightYear() {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  setupScrollToTop() {
    const scrollToTopBtn = document.createElement("button");
    scrollToTopBtn.className = "scroll-to-top";
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollToTopBtn);

    const style = document.createElement("style");
    style.textContent = `
      .scroll-to-top {
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background: var(--primary-color, #007bff);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      }
      .scroll-to-top:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      }
      .scroll-to-top.visible {
        display: block;
      }
    `;
    document.head.appendChild(style);

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.pageYOffset > 300) {
          scrollToTopBtn.classList.add("visible");
        } else {
          scrollToTopBtn.classList.remove("visible");
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      scrollToTopBtn.blur();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PortfolioEnhancer();
});
