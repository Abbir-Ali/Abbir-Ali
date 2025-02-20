document.addEventListener("DOMContentLoaded", function () {
    // Attach event listener to all + icons
    document.querySelectorAll(".circle").forEach(circle => {
        circle.addEventListener("click", function () {
            let productId = this.getAttribute("data-product-id");
            let productHandle = this.getAttribute("data-product-handle");

            console.log("Product ID:", productId);
            console.log("Product Handle:", productHandle);

            openQuickView(productId, productHandle);
        });
    });
});

// Function to Open Quick View Modal
function openQuickView(productId, productHandle) {
    let modal = document.getElementById("quickViewModal");

    if (!modal) {
        console.error("Quick View Modal not found!");
        return;
    }

    // Show Modal
    modal.classList.add("active");
}

// Function to Close Quick View Modal
function closeQuickView() {
    let modal = document.getElementById("quickViewModal");

    if (modal) {
        modal.classList.remove("active");
    }
}
