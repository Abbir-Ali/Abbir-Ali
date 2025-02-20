document.addEventListener("DOMContentLoaded", function () {
    let selectedOptions = {}; // Stores user-selected options

    // Attach event listener to all option dropdowns
    document.querySelector(".my-modal-content").addEventListener("change", function (event) {
        if (event.target.classList.contains("product-option")) {
            let optionName = event.target.getAttribute("data-option-name");
            let optionValue = event.target.value;

            // Store selected option
            selectedOptions[optionName] = optionValue;

            console.log("Selected Options:", selectedOptions);

            // Update selected variant
            updateSelectedVariant();
        }
    });
});

// Function to Find & Update Selected Variant
function updateSelectedVariant() {
    let productVariants = window.currentProduct.variants;

    // Find matching variant
    let matchedVariant = productVariants.find(variant => {
        return variant.options.every((option, index) => {
            let optionName = window.currentProduct.options[index];
            return selectedOptions[optionName] === option;
        });
    });

    if (matchedVariant) {
        console.log("Matched Variant:", matchedVariant);
        document.querySelector(".add-to-cart-btn").setAttribute("data-variant-id", matchedVariant.id);
    } else {
        console.log("No matching variant found");
    }
}

// Function to Open Quick View & Fetch Product Data
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
            window.currentProduct = product; // Store globally for variant selection

            let optionsHTML = "";
            product.options.forEach((option, index) => {
                optionsHTML += `<label>${option}: 
                    <select class="product-option" data-option-name="${option}">
                        ${product.variants.map(variant => `<option>${variant.options[index]}</option>`).join("")}
                    </select>
                </label>`;
            });

            document.querySelector(".my-modal-content").innerHTML = `
                <div class="modal-image">
                    <img src="${product.images[0]}" alt="${product.title}">
                </div>
                <h2>${product.title}</h2>
                <p>${product.body_html}</p>
                <p class="modal-price"><strong>Price:</strong> ${product.variants[0].price}</p>
                ${optionsHTML}
                <button class="add-to-cart-btn" onclick="addToCart()">Add to Cart</button>
            `;

            // Show Modal
            modal.classList.add("active");
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
        });
}

// Function to Add to Cart with Selected Variant
function addToCart() {
    let variantId = document.querySelector(".add-to-cart-btn").getAttribute("data-variant-id");

    if (!variantId) {
        alert("Please select all options before adding to cart.");
        return;
    }

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

// Function to Close Quick View
function closeQuickView() {
    let modal = document.getElementById("quickViewModal");
    if (modal) {
        modal.classList.remove("active");
    }
}
