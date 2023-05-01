let burgerButton = document.getElementById("burger-menu");
let create = document.querySelector("#create");

burgerButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (window.innerWidth <= 600) {
    if (create.style.display === "none") {
      create.style.display = "flex";
    } else {
      create.style.display = "none";
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 600) {
    create.style.display = "flex";
  }
});
