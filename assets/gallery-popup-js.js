const popup = document.getElementById("imagePopup");
const popupImage = document.getElementById("popupImage");
const closeBtn = document.querySelector(".close");

document.querySelectorAll(".popup-img").forEach(img => {
  img.addEventListener("click", () => {
    popup.style.display = "flex";
    popupImage.src = img.src;
  });
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});
 