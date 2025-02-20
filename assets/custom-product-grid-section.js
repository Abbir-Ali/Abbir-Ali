document.addEventListener("DOMContentLoaded", function () {
    const modalOverlay = document.querySelector(".my-modal-overlay");
    const modalContainer = document.querySelector(".my-modal-content");
    let productId, productHandle, selectedOptions = {}, variantId, form;

    // Attach event listener for opening modal
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("circle")) {
            productId = event.target.getAttribute("data-product-id");
            productHandle = event.target.getAttribute("data-product-handle");

            console.log("Fetching Product:", productHandle);

            fetch(`/products/${productHandle}?section_id=modal-content`)
                .then(response => response.text())
                .then(text => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(text, "text/html");
                    let modalContent = doc.querySelector("#shopify-section-modal-content")
                        ? doc.querySelector("#shopify-section-modal-content").innerHTML
                        : "";

                    if (modalOverlay) modalOverlay.classList.add("active");
                    if (modalContainer) modalContainer.innerHTML = modalContent;

                    document.body.style.overflow = "hidden";

                    // Set up event listeners for variant selection
                    setupVariantSelection();
                });
        }
    });

    // Close Modal
    document.querySelector(".modal-close").addEventListener("click", function () {
        closeQuickView();
    });

    function closeQuickView() {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    // Setup Event Listeners for Option Selection
    function setupVariantSelection() {
        let option1 = document.querySelectorAll(".mc-color");
        let option2 = document.querySelectorAll(".mc-select");
        let selectMain = document.querySelectorAll("select[name='id'] option");

        if (option1) {
            option1.forEach((option) => {
                if (option.checked) {
                    selectedOptions["option1"] = option.value;
                }
                option.addEventListener("change", updateSelectedOption);
            });
        }

        if (option2) {
            option2.forEach((option) => {
                option.addEventListener("change", updateSelectedOption);
            });
        }

        form = document.getElementById(`product-form-${productId}`);
        if (form) form.addEventListener("submit", formSubmitHandler);
    }

    // Handle Option Selection
    function updateSelectedOption(event) {
        let optionName = event.target.name;
        let optionValue = event.target.value;

        selectedOptions[optionName] = optionValue;

        console.log("Selected Options:", selectedOptions);

        updateSelectedVariant();
    }

    // Match Selected Options to Correct Variant
    function updateSelectedVariant() {
        let productVariants = window.currentProduct.variants;

        let selectedVariantTitle = Object.values(selectedOptions).join(" / ").toLowerCase();

        let matchedVariant = productVariants.find(variant => variant.title.toLowerCase() === selectedVariantTitle);

        if (matchedVariant) {
            console.log("Matched Variant:", matchedVariant);
            document.querySelector(".modal-price span").innerText = matchedVariant.price;
            document.querySelector(".add-to-cart-btn").setAttribute("data-variant-id", matchedVariant.id);
        } else {
            console.log("No matching variant found.");
        }
    }

    // Add to Cart
    function addToCart() {
        let variantId = document.querySelector(".add-to-cart-btn").getAttribute("data-variant-id");

        if (!variantId) {
            alert("Please select all options before adding to cart.");
            return;
        }

        let prodObject = {
            items: [{ id: variantId, quantity: 1 }],
            sections: "cart-drawer,cart-icon-bubble",
        };

        fetch("/cart/add.js", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(prodObject),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Added to Cart:", data);
                closeQuickView();
                updateCart(data);
            })
            .catch(error => {
                console.log("Error in adding to cart", error);
            });
    }

    // Update Cart UI
    function updateCart(data) {
        const sectionData = data.sections;

        document.querySelector("#CartDrawer").innerHTML = new DOMParser()
            .parseFromString(sectionData["cart-drawer"], "text/html")
            .querySelector("#CartDrawer").innerHTML;

        document.querySelector("#cart-icon-bubble").innerHTML = new DOMParser()
            .parseFromString(sectionData["cart-icon-bubble"], "text/html")
            .getElementById("shopify-section-cart-icon-bubble").innerHTML;

        document.querySelector("#cart-icon-bubble").click();
    }
});
