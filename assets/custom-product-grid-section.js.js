document.addEventListener("DOMContentLoaded", function () {
    // Function to Open Quick View Modal
    window.openQuickView = function (element) {
        let productId = element.getAttribute("data-product-id");

        // Ensure modal file function exists
        if (typeof showModal === "function") {
            showModal(productId);
        } else {
            console.error("Modal function not found.");
        }
    };
});
