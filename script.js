function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("active");
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  localStorage.setItem("7g-theme", dark ? "dark" : "light");

  document.querySelector(".theme-btn").textContent =
    dark ? "☀️" : "🌙";
}

window.addEventListener("DOMContentLoaded", () => {

  const savedTheme = localStorage.getItem("7g-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.querySelector(".theme-btn").textContent = "☀️";
  }

});


window.addEventListener("scroll", () => {

  const button = document.getElementById("topBtn");

  if (window.scrollY > 500) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }

});


document.querySelectorAll("#navMenu a").forEach(link => {

  link.addEventListener("click", () => {
    document.getElementById("navMenu")
      .classList.remove("active");
  });

});
