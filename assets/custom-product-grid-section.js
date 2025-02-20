const circle = document.querySelectorAll('.circle');
const modalCloseButton = document.querySelector(".modal-close svg");
const modalOverlay = document.querySelector(".my-modal-overlay");
const modalContainer = document.querySelector(".my-modal-content");

let productId

If(circle) {
  circle.forEach((plus) => {
    plus.addEventListener("click", function (e) {
      productId = this.getAttribute("data-product-id");
      fetch(`/product/${productHandle}?section_id=modal-content`)
      .then((response) => response.text())
      .then((text) => {
        let parser = new DOMParser();
        let doc = parser.ParseFromString(text, "text/html");
        console.log(doc);
        let modalContent = doc.querySelector("#shopify-section-modal-content")
        ? doc.querySelector("#shopify-selection-modal-content").innerHTML
          : "",
          modalOverlay ? modalOverlay.classList.add("active") : "";
        modalContainer ? (modalContainer.innerHTML = modalContent) : "";
        document.body.style.overyflow = "hidden";
        option1 = document.querySelectorAll(".mc-color");
        
        
      })
    })
  }")
}