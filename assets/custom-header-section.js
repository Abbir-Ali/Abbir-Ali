const openIcon = document.querySelector(".open-icon");
const closeIcon = document.querySelector(".close-icon");
const mobileMenu = document.querySelector(".mobile-menu");

if (openIcon) {
  openIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    this.style.display = "none";
    if (mobileMenu) mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
    if (closeIcon) closeIcon.style.display = "block";
  });
}

if (closeIcon) {
  closeIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    this.style.display = "none";
    if (mobileMenu) mobileMenu.classList.remove("active"); // Fixed: Should remove "active" instead of adding it
    document.body.style.overflow = "scroll";
    if (openIcon) openIcon.style.display = "block";
  });
}
