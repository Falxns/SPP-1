window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("image").addEventListener("input", (event) => {
    const fr = new FileReader();
    fr.onload = function () {
      document.getElementById("image-add").src = fr.result;
    };
    fr.readAsDataURL(event.target.files[0]);
  });
});
