document.addEventListener("DOMContentLoaded", function () {
    let selectedOptions = {}; // Stores user-selected options

    // Event Delegation to Listen for Option Changes
    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("product-option")) {
            let optionName = event.target.getAttribute("data-option-name");
            let optionValue = event.target.value;

            // Store selected option
            selectedOptions[optionName] = optionValue;

            console.log("Selected Options:", selectedOptions);

            // Update selected variant based on chosen options
            updateSelectedVariant();
        }
    });
});

// Function to Find & Update Selected Variant
function updateSelectedVariant() {
    if (!window.currentProduct) return;

    let productVariants = window.currentProduct.variants;

    // Convert selected options to Shopify format (e.g., "m / red")
    let selectedVariantTitle = Object.values(selectedOptions).join(" / ").toLowerCase();
    console.log("Matching Variant Title:", selectedVariantTitle);

    // Find matching variant by title
    let matchedVariant = productVariants.find(variant => variant.title.toLowerCase() === selectedVariantTitle);

    if (matchedVariant) {
        console.log("Matched Variant:", matchedVariant);

        // Update price in modal
        document.querySelector(".modal-price span").innerText = matchedVariant.price;

        // Update ATC button with correct variant ID
        document.querySelector(".add-to-cart-btn").setAttribute("data-variant-id", matchedVariant.id);
    } else {
        console.log("No matching variant found.");
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

            let productImage = product.images.length > 0 ? product.images[0] : "{{ 'product1.png' | asset_url }}";

            let optionsHTML = "";
            product.options.forEach((option, index) => {
                let optionValues = [...new Set(product.variants.map(variant => variant.options[index]))];

                optionsHTML += `<label>${option}: 
                    <select class="product-option" data-option-name="${option}">
                        <option value="">Select ${option}</option>
                        ${optionValues.map(value => `<option>${value}</option>`).join("")}
                    </select>
                </label>`;
            });

            document.querySelector(".my-modal-content").innerHTML = `
                <div class="modal-image">
                    <img src="${productImage}" alt="${product.title}">
                </div>
                <h2>${product.title}</h2>
                <p>${product.body_html}</p>
                <p class="modal-price"><strong>Price:</strong> <span>${product.variants[0].price}</span></p>
                ${optionsHTML}
                <button class="add-to-cart-btn" onclick="addToCart()">
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

// Function to Close Quick View Modal
function closeQuickView() {
    let modal = document.getElementById("quickViewModal");
    if (modal) {
        modal.classList.remove("active");
    }
}
