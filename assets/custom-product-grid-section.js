document.addEventListener("DOMContentLoaded", function () {
    const modalOverlay = document.querySelector(".my-modal-overlay");
    const modalContainer = document.querySelector(".my-modal-content");

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("circle")) {
          productID= this.getAttribute("data-product-id");
            let productHandle = event.target.getAttribute("data-product-handle");

            console.log("Fetching Product:", productHandle);

           fetch(`/products/${productHandle}.json`)
    .then(response => response.json())
    .then(data => {
        let product = data.product;
        console.log("Fetched product:", product);

        // Check if images exist
        console.log("Product Images:", product.images);
        console.log("Product Variants:", product.variants);

        if (!product.images || product.images.length === 0) {
            console.warn("No images found for this product.");
        }

        if (!product.variants || product.variants.length === 0) {
            console.warn("No variants found for this product.");
        }

        if (!product.image && (!product.images || product.images.length === 0)) {
            console.error("Both product.image and product.images are missing!");
        }
    })
    .catch(error => {
        console.error("Error fetching product data:", error);
    });

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
                })
                .catch(error => {
                    console.error("Error fetching product data:", error);
                });
        }
    });
});
