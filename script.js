/**
 * Portfolio Enhancement Script
 * Modular, performant, and accessible improvements to the portfolio
 */

class PortfolioEnhancer {
  constructor() {
    this.init();
  }

  // Initialize all enhancements
  init() {
    this.setupSmoothScrolling();
    this.setupProfileModal();
    this.setupMobileNavigation();
    this.setupScrollProgress();
    this.setupIntersectionObserver();
    this.setupContactForm();
    this.setupThemeToggle();
    this.setupCopyrightYear();
    this.setupScrollToTop();
    this.setupSkillsWave();
  }

  // 1. Improved smooth scrolling with offset for fixed header
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

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // 2. Enhanced profile image modal with keyboard accessibility
  setupProfileModal() {
    const modal = document.getElementById("photoModal");
    if (!modal) return;

    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const profilePic = document.querySelector(".profile-pic");
    const closeBtn = document.querySelector(".close");

    const openModal = () => {
      modal.style.display = "block";
      modalImg.src = profilePic.src;
      captionText.textContent = profilePic.alt;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    const closeModal = () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
      profilePic.focus();
    };

    if (profilePic) {
      profilePic.addEventListener("click", openModal);
      profilePic.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
      closeBtn.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
      });
    }

    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // 3. Mobile navigation with improved accessibility
  setupMobileNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (!hamburger || !navLinks) return;

    const toggleMenu = () => {
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    };

    hamburger.setAttribute("aria-label", "Toggle navigation menu");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-controls", "nav-links");

    hamburger.addEventListener("click", toggleMenu);

    // Close menu when clicking on links
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        toggleMenu();
        hamburger.focus();
      }
    });
  }

  // 4. Debounced scroll progress indicator
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

    // Debounce the scroll event
    let isScrolling;
    window.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(updateScrollProgress, 50);
      },
      { passive: true }
    );

    // Initial update
    updateScrollProgress();
  }

  // 5. Optimized Intersection Observer with fallback
  setupIntersectionObserver() {
    const animateElements = document.querySelectorAll(
      ".card, .section h2, .about-content"
    );
    if (!animateElements.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      animateElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for browsers without IntersectionObserver
      animateElements.forEach((el) => el.classList.add("animate"));
    }
  }

  // 6. Enhanced contact form with validation
  setupContactForm() {
    const contactForm = document.querySelector(".contact-form");
    if (!contactForm) return;

    const validateForm = () => {
      let isValid = true;
      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const messageInput = contactForm.querySelector(
        'textarea[name="message"]'
      );

      // Simple validation
      if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.classList.add("error");
      } else {
        nameInput.classList.remove("error");
      }

      if (
        !emailInput.value.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
      ) {
        isValid = false;
        emailInput.classList.add("error");
      } else {
        emailInput.classList.remove("error");
      }

      if (!messageInput.value.trim()) {
        isValid = false;
        messageInput.classList.add("error");
      } else {
        messageInput.classList.remove("error");
      }

      return isValid;
    };

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      const statusMessage = document.createElement("div");
      statusMessage.className = "form-status";
      contactForm.appendChild(statusMessage);

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        statusMessage.textContent = "";
        statusMessage.classList.remove("error", "success");

        // Simulate API call - replace with actual fetch
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // await fetch("https://formspree.io/f/your-form-id", {
        //   method: "POST",
        //   body: formData,
        //   headers: { Accept: "application/json" },
        // });

        contactForm.reset();
        statusMessage.textContent = "Message sent successfully!";
        statusMessage.classList.add("success");
      } catch (error) {
        statusMessage.textContent =
          "Error sending message. Please try again later.";
        statusMessage.classList.add("error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        setTimeout(() => statusMessage.remove(), 5000);
      }
    });
  }

  // 7. Theme toggle with system preference detection
  setupThemeToggle() {
    const modeToggle = document.createElement("button");
    modeToggle.className = "mode-toggle";
    modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    modeToggle.setAttribute("aria-label", "Toggle dark mode");
    document.body.appendChild(modeToggle);

    const getPreferredTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) return storedTheme;
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    };

    const setTheme = (theme) => {
      document.body.classList.toggle("light-mode", theme === "light");
      const icon = modeToggle.querySelector("i");
      icon.classList.toggle("fa-moon", theme === "dark");
      icon.classList.toggle("fa-sun", theme === "light");
      localStorage.setItem("theme", theme);
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    // Watch for system preference changes
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          setTheme(e.matches ? "light" : "dark");
        }
      });

    // Toggle on click
    modeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-mode");
      setTheme(isLight ? "dark" : "light");
    });
  }

  // 8. Copyright year update
  setupCopyrightYear() {
    const copyrightElement = document.querySelector(".copyright");
    if (copyrightElement) {
      copyrightElement.textContent = `© ${new Date().getFullYear()} ${
        copyrightElement.textContent.match(/© \d{4} (.*)/)?.[1] ||
        "All rights reserved."
      }`;
    }
  }

  // 9. Scroll-to-top button with debounce
  setupScrollToTop() {
    const scrollToTopBtn = document.createElement("button");
    scrollToTopBtn.className = "scroll-to-top";
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollToTopBtn);

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollToTopBtn.style.display =
          window.pageYOffset > 300 ? "block" : "none";
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      scrollToTopBtn.blur(); // Remove focus after clicking
    });
  }

  // 10. Enhanced skills wave with pause on focus
  setupSkillsWave() {
    const skillsContainer = document.querySelector(".skill-items-container");
    const skillsWave = document.querySelector(".skill-items-wave");

    if (!skillsContainer || !skillsWave) return;

    const skills = [
      { name: "Python", icon: "fab fa-python" },
      { name: "SQL", icon: "fas fa-database" },
      { name: "JavaScript", icon: "fab fa-js" },
      { name: "HTML5", icon: "fab fa-html5" },
      { name: "CSS3", icon: "fab fa-css3-alt" },
      { name: "Git", icon: "fab fa-git-alt" },
      { name: "GitHub", icon: "fab fa-github" },
      { name: "PowerPoint", icon: "fab fa-microsoft" },
      { name: "C", icon: "fas fa-code" },
      { name: "C++", icon: "fas fa-code" },
      { name: "Linux", icon: "fab fa-linux" },
      { name: "Canva", icon: "fas fa-palette" },
      { name: "AI Tools", icon: "fas fa-robot" },
      { name: "ChatGPT", icon: "fas fa-comment-alt" },
    ];

    // Create skill items with keyboard accessibility
    skillsWave.innerHTML = [...skills, ...skills]
      .map(
        (skill) => `
        <div class="skill-item" tabindex="0">
          <i class="${skill.icon}" aria-hidden="true"></i>
          <span>${skill.name}</span>
        </div>
      `
      )
      .join("");

    const duration = skills.length * 2;
    skillsWave.style.animationDuration = `${duration}s`;

    // Pause animation on interaction
    const pauseAnimation = () =>
      (skillsWave.style.animationPlayState = "paused");
    const resumeAnimation = () =>
      (skillsWave.style.animationPlayState = "running");

    skillsWave.addEventListener("mouseenter", pauseAnimation);
    skillsWave.addEventListener("mouseleave", resumeAnimation);
    skillsWave.addEventListener("focusin", pauseAnimation);
    skillsWave.addEventListener("focusout", resumeAnimation);
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioEnhancer();
});
