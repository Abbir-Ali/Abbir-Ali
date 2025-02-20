document.addEventListener("DOMContentLoaded", function () {
    const modalOverlay = document.querySelector(".my-modal-overlay");
    const modalContainer = document.querySelector(".my-modal-content");

    let productID; // ✅ Fixed syntax error

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("circle")) {
            productID = event.target.getAttribute("data-product-id"); // ✅ Fixed `this`
            let productHandle = event.target.getAttribute("data-product-handle");

            console.log("Fetching Product:", productHandle, "Product ID:", productID);

            fetch(`/products/${productHandle}.json`)
                .then(response => response.json())
                .then(data => {
                    let product = data.product;
                    console.log("Fetched product:", product);

                    // ✅ Get featured image or fallback image
                    let productImage = product.image && product.image.src
                        ? product.image.src
                        : (product.images && product.images.length > 0
                            ? product.images[0].src
                            : "{{ 'product1.png' | asset_url }}");

                    // ✅ Get product variants safely
                    let firstVariant = product.variants && product.variants.length > 0
                        ? product.variants[0]
                        : { price: "N/A", id: "" };

                    // ✅ Generate options dropdown
                    let optionsHTML = "";
                    if (product.options && product.options.length > 0) {
                        product.options.forEach((option, index) => {
                            let optionValues = [...new Set(product.variants.map(variant => variant.options[index]))];

                            optionsHTML += `<label>${option}: 
                                <select class="product-option" data-option-name="${option}">
                                    <option value="">Select ${option}</option>
                                    ${optionValues.map(value => `<option>${value}</option>`).join("")}
                                </select>
                            </label>`;
                        });
                    }

                    // ✅ Populate the modal with product details
                    modalContainer.innerHTML = `
                        <div class="modal-image">
                            <img src="${productImage}" alt="${product.title}">
                        </div>
                        <h2>${product.title}</h2>
                        <p>${product.body_html || "No description available."}</p>
                        <p class="modal-price"><strong>Price:</strong> <span>${firstVariant.price}</span></p>
                        ${optionsHTML}
                        <button class="add-to-cart-btn" data-variant-id="${firstVariant.id}">
                            Add to Cart
                        </button>
                    `;

                    // ✅ Show the modal
                    modalOverlay.classList.add("active");
                })
                .catch(error => {
                    console.error("Error fetching product data:", error);
                });
        }
    });
});
