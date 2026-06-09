const hairColourBtns = document.querySelectorAll(".colour-btn")
const hairstyleImage = document.getElementById("hairstyleImage")

hairColourBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove selected from all buttons
        hairColourBtns.forEach(b => b.classList.remove("selected"));

        // Mark this button as selected
        btn.classList.add("selected");

         hairstyleImage.style.opacity = "0";

        setTimeout(() => {
            hairstyleImage.src = btn.dataset.image;
            hairstyleImage.style.opacity = "1";
        }, 300); // matches the CSS transition duration
    });
        
});
