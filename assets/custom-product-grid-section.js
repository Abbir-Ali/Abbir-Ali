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

            // Check if images exist before using them
            let productImage = product.images.length > 0 ? product.images[0] : "{{ 'product1.png' | asset_url }}";

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
                    <img src="${productImage}" alt="${product.title}">
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
