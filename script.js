document.getElementById("contactBtn").addEventListener("click", () => {
  const emailElem = document.getElementById("email");
  if (emailElem.style.display === "none") {
    emailElem.style.display = "block";
  } else {
    emailElem.style.display = "none";
  }
});
