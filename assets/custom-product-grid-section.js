document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".circle").forEach(circle => {
        circle.addEventListener("click", function () {
            let productHandle = this.getAttribute("data-product-handle");
            console.log("Fetching product:", productHandle);

            openQuickView(productHandle);
        });
    });
});

// Function to Fetch and Show Product Data
function openQuickView(productHandle) {
    let modal = document.getElementById("quickViewModal");

    if (!modal) {
        console.error("Quick View Modal not found!");
        return;
    }

    // Shopify API URL to Fetch Product Data
    let productURL = `/products/${productHandle}.json`;

    fetch(productURL)
        .then(response => response.json())
        .then(data => {
            let product = data.product;

            // Build Product Options if Available
            let optionsHTML = "";
            if (product.options && product.options.length > 0) {
                optionsHTML = `<div class="modal-options"><strong>Options:</strong>`;
                product.options.forEach(option => {
                    optionsHTML += `<label>${option.name}: 
                    <select>`;
                    option.values.forEach(value => {
                        optionsHTML += `<option>${value}</option>`;
                    });
                    optionsHTML += `</select></label>`;
                });
                optionsHTML += `</div>`;
            }

            // Replace Dummy Content with Product Data
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
    document.getElementById("quickViewModal").classList.remove("active");
}

// Function to Add to Cart
function addToCart(variantId) {
    fetch("/cart/add.js", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        alert("Product added to cart!");
        closeQuickView();
    })
    .catch(error => console.error("Error adding to cart:", error));
}
