document.addEventListener("DOMContentLoaded", function () {
    const modalOverlay = document.querySelector(".my-modal-overlay");
    const modalContainer = document.querySelector(".my-modal-content");
    let productId, productHandle, selectedOptions = {}, variantId, form;

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("circle")) {
            productId = event.target.getAttribute("data-product-id");
            productHandle = event.target.getAttribute("data-product-handle");

            console.log("Fetching Product:", productHandle);

            fetch(`/products/${productHandle}.json`) // ✅ FIXED API URL
                .then(response => response.json())
                .then(data => {
                    let product = data.product;
                    console.log("Fetched product:", product);

                    if (modalOverlay) modalOverlay.classList.add("active");

                    let productImage = product.images.length > 0 ? product.images[1] : "{{ 'product1.png' | asset_url }}";

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

                    modalContainer.innerHTML = `
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

                    // Attach event listeners for variants
                    setupVariantSelection(product);
                })
                .catch(error => {
                    console.error("Error fetching product data:", error);
                });
        }
    });

    function setupVariantSelection(product) {
        let optionSelects = document.querySelectorAll(".product-option");
        optionSelects.forEach(select => {
            select.addEventListener("change", function () {
                let selectedValues = Array.from(optionSelects).map(s => s.value).filter(v => v !== "");
                let selectedVariantTitle = selectedValues.join(" / ").toLowerCase();

                let matchedVariant = product.variants.find(variant => variant.title.toLowerCase() === selectedVariantTitle);

                if (matchedVariant) {
                    console.log("Matched Variant:", matchedVariant);
                    document.querySelector(".modal-price span").innerText = matchedVariant.price;
                    document.querySelector(".add-to-cart-btn").setAttribute("data-variant-id", matchedVariant.id);
                }
            });
        });
    }

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

    function closeQuickView() {
    let modal = document.getElementById("quickViewModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

});
