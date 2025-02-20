document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".circle").forEach(circle => {
        circle.addEventListener("click", function () {
            let productId = this.getAttribute("data-product-id");
            let productHandle = this.getAttribute("data-product-handle");

            console.log("Product ID:", productId);
            console.log("Product Handle:", productHandle);

            // Pass to modal function
            openQuickView(productId, productHandle);
        });
    });
});

function openQuickView(productId, productHandle) {
    // Now you have both ID and Handle
    console.log(`Opening Quick View for Product: ID=${productId}, Handle=${productHandle}`);

    // Ensure the modal function is defined
    if (typeof showModal === "function") {
        showModal(productId, productHandle);
    } else {
        console.error("Modal function not found.");
    }
}
