document.addEventListener("DOMContentLoaded", function () {
    console.log("Quick View script loaded.");

    // Event Delegation for dynamically loaded elements
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("circle")) {
            let productId = event.target.getAttribute("data-product-id");
            let productHandle = event.target.getAttribute("data-product-handle");

            console.log("Clicked on + icon!"); // Debugging
            console.log("Product ID:", productId);
            console.log("Product Handle:", productHandle);

            openQuickView(productHandle);
        }
    });
});

// Function to Open Quick View Modal & Fetch Product Data
function openQuickView(productHandle) {
    let modal = document.getElementById("quickViewModal");

    if (!modal) {
        console.error("Quick View Modal not found!");
        return;
    }

    let productURL = `/products/${productHandle}.json`;

    fetch(productURL)
        .then(response => response.json())
        .then(data => {
            let product = data.product;

            console.log("Fetched product:", product);

            // Generate product options HTML
            let optionsHTML = "";
            if (product.options && product.options.length > 0) {
                optionsHTML = `<div class="modal-options"><strong>Options:</strong>`;
                product.options.forEach((option, index) => {
                    optionsHTML += `<label>${option}: 
                        <select class="product-option" data-option-name="${option}">
                            ${product.variants.map(variant => `<option>${variant.options[index]}</option>`).join("")}
                        </select>
                    </label>`;
                });
                optionsHTML += `</div>`;
            }

            // Update modal content dynamically
            document.querySelector(".my-modal-content").innerHTML = `
                <div class="modal-image">
                    <img src="${product.images[0]}" alt="${product.title}">
                </div>
                <h2>${product.title}</h2>
                <p>${product.body_html}</p>
                <p class="modal-price"><strong>Price:</strong> ${product.variants[0].price}</p>
                ${optionsHTML}
                <button class="add-to-cart-btn" onclick="addToCart(${product.variants[0].id})">
                    Add to Cart
                </button>
            `;

            // Show Modal
            modal.classList.add("active");
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
        });
}

// Function to Close Quick View Modal
function closeQuickView() {
    let modal = document.getElementById("quickViewModal");
    if (modal) {
        modal.classList.remove("active");
    }
}
