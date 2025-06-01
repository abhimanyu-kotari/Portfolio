// Smooth scroll on anchor links (you already have this)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Modal image popup for profile pic
const modal = document.getElementById("photoModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const profilePic = document.querySelector(".profile-pic");
const closeBtn = document.querySelector(".close");

profilePic.onclick = function () {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

// Close modal when clicking outside the image
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
