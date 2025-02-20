document.addEventListener("DOMContentLoaded", function () {
    console.log("Quick View script loaded.");

    document.querySelectorAll(".circle").forEach(circle => {
        circle.addEventListener("click", function () {
            let productId = this.getAttribute("data-product-id");
            let productHandle = this.getAttribute("data-product-handle");

            console.log("Clicked on + icon!"); // Debugging
            console.log("Product ID:", productId);
            console.log("Product Handle:", productHandle);

            openQuickView(productHandle);
        });
    });
});
