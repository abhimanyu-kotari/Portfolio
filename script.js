// portfolio-enhancements.js
document.addEventListener("DOMContentLoaded", function () {
  // 1. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 2. Profile image modal
  const modal = document.getElementById("photoModal");
  if (modal) {
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const profilePic = document.querySelector(".profile-pic");
    const closeBtn = document.querySelector(".close");

    if (profilePic) {
      profilePic.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
      };
    }

    if (closeBtn) {
      closeBtn.onclick = function () {
        modal.style.display = "none";
      };
    }

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }

  // 3. Mobile navigation toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // 4. Scroll progress indicator
  window.addEventListener("scroll", () => {
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
  });

  // 5. Intersection Observer for animations
  const animateOnScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".card, .section h2, .about-content")
      .forEach((el) => {
        observer.observe(el);
      });
  };
  animateOnScroll();

  // 6. Contact form handling
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        // Replace with your actual form endpoint
        await fetch("https://formspree.io/f/your-form-id", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        contactForm.reset();
        alert("Message sent successfully!");
      } catch (error) {
        alert("Error sending message. Please try again later.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // 7. Dark/light mode toggle
  const modeToggle = document.createElement("button");
  modeToggle.className = "mode-toggle";
  modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  modeToggle.title = "Toggle Dark Mode";
  document.body.appendChild(modeToggle);

  modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const icon = modeToggle.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light-mode") ? "light" : "dark"
    );
  });

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    const icon = modeToggle.querySelector("i");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  // 8. Dynamic copyright year
  const copyrightElement = document.querySelector(".copyright");
  if (copyrightElement) {
    copyrightElement.textContent = `© ${new Date().getFullYear()} Abhimanyu Kotari. All rights reserved.`;
  }

  // 9. Scroll-to-top button
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.title = "Scroll to top";
  document.body.appendChild(scrollToTopBtn);

  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.pageYOffset > 300 ? "block" : "none";
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
