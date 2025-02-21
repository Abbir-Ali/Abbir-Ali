const circle = document.querySelectorAll(".circle");
const modalCloseButton = document.querySelector(".modal-close svg");
const modalOverlay = document.querySelector(".my-modal-overlay");
const modalContainer = document.querySelector(".my-modal-content");
let productId,
  form,
  option1,
  option2,
  selectMain,
  option1Value,
  option2Value,
  variantId;

if (circle) {
  circle.forEach((plus) => {
    plus.addEventListener("click", function (e) {
      productId = this.getAttribute("data-product-id");
      const productHandlde = this.getAttribute("data-product-handle");
      fetch(`/products/${productHandlde}?section_id=modal-content`)
        .then((response) => response.text())
        .then((text) => {
          let parser = new DOMParser();
          let doc = parser.parseFromString(text, "text/html");
          console.log(doc);
          let modalContent = doc.querySelector("#shopify-section-modal-content")
            ? doc.querySelector("#shopify-section-modal-content").innerHTML
            : "";
          modalOverlay ? modalOverlay.classList.add("active") : "";
          modalContainer ? (modalContainer.innerHTML = modalContent) : "";
          document.body.style.overflow = "hidden";
          option1 = document.querySelectorAll(".mc-color");
          option2 = document.querySelectorAll(".mc-select");
          selectMain = document.querySelectorAll("select[name='id'] option");
          if (option1) {
            option1.forEach((option1Item) => {
              if (option1Item.checked) {
                option1Value = option1Item.value;
              }
              option1Item.addEventListener("change", option1Handler);
            });
          }
          if (option2) {
            option2.forEach(function (item) {
              item.addEventListener("change", option2Handler);
            });
          }
     
          form = document.getElementById(`product-form-${productId}`);
          form.addEventListener("submit", formSubmitHandler);
        });
    });
  });
}
if (modalCloseButton) {
  modalCloseButton.addEventListener("click", function (e) {
    hideModal();
  });
}
function hideModal() {
  modalOverlay ? modalOverlay.classList.remove("active") : "";
  document.body.style.overflow = "auto";
}
function option1Handler(e) {
  option1Value = e.target.value;
  // console.log("option1Value:", option1Value);
  updatePrice();
}
function option2Handler(e) {
  option2Value = e.target.value;
  updatePrice();
}

function updatePrice() {
  attributeSetter();
  let varPrice = document
    .querySelector("select[name='id'] option[selected='selected']")
    .getAttribute("data-price");
  const regularPrice = document.querySelector(".mc-regular-price");
  regularPrice.innerHTML = varPrice;
}

function attributeSetter() {
  selectMain.forEach((item) => {
  
    let numberOfProductOptions = Number(document.querySelector(".product-options-size").innerHTML);
    if(numberOfProductOptions > 1) {
      // console.log("Product options are greater than 1");
      if (item.text.includes(`${option1Value} / ${option2Value}`)) {
        item.setAttribute("selected", "selected");
      }
      else {
        item.removeAttribute("selected");
      }      
    }
    else {
      // console.log("Product option is 1");
      if (item.text.includes(`${option1Value}`)) {
        item.setAttribute("selected", "selected");
      }
      else {
        item.removeAttribute("selected");
      }
      if(item.text.includes(`${option2Value}`)) {
        item.setAttribute("selected", "selected");
      }
      else {
        item.removeAttribute("selected");
      }
     
    }

  });
}

function formSubmitHandler(e) {
  e.preventDefault();
  attributeSetter();
  let formData = new FormData(form);
  variantId = formData.get("id");
  addingToCart(variantId);
}

function addingToCart(varId) {
  let prodObject = {
    items: [{ id: varId, quantity: 1 }],
    sections: "cart-drawer,cart-icon-bubble",
  };

  if (
    (option1Value == "black" || option1Value == "Black") &&
    (option2Value == "M" || option2Value == "m")
  ) {
    prodObject.items.push({ id: 8085424799884, quantity: 1 });
  }

  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(prodObject),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      hideModal();
      cartRender(data);
    })
    .catch((error) => {
      console.log("Error in adding to cart", error);
    });
}
function getElementToShow() {
  return [
    {
      id: "cart-drawer",
      selector: "#CartDrawer",
    },
    {
      id: "cart-icon-bubble",
    },
  ];
}

function cartRender(data) {
  const sectionData = data.sections;
  getElementToShow().forEach((item) => {
    if (item.selector) {
      document.querySelector(item.selector).innerHTML = new DOMParser()
        .parseFromString(sectionData[item.id], "text/html")
        .querySelector(item.selector).innerHTML;
    } else {
      document.getElementById(item.id).innerHTML = new DOMParser()
        .parseFromString(sectionData[item.id], "text/html")
        .getElementById(`shopify-section-${item.id}`).innerHTML;
    }
  });
  document.querySelector("cart-drawer").classList.contains("is-empty") &&
    document.querySelector("cart-drawer").classList.remove("is-empty");
  const cartIcon = document.querySelector("#cart-icon-bubble");
  cartIcon.click();
}
