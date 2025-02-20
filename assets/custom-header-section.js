const openIcon = document.querySelector(".open-icon");
const closeIcon = document.querySelector(".close-icon");
const mobileMenu = document.querySelector(".mobile-menu");

if (openIcon) {
  openIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    this.style.display="none";
    mobileMenu ? mobileMenu.classList.add("active"): "";
    document.body.style.overflow = "hidden";
    closeIcon ? closeIcon.style.display = "block": "";
  })
} 

if (closeIcon) {
  closeIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    this.style.display="none";
    mobileMenu ? mobileMenu.classList.add("active"): "";
    document.body.style.overflow = "scroll";
    openIcon ? openIcon.style.display = "block": "";
  })
} 