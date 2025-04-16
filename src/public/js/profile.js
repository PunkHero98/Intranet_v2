$(".change-picture").on("click", function (e) {
  e.preventDefault();
  const fileInput = $("#Upload");
  fileInput.click();
});
$(".add-Btn").css("display", "none");

$("#Upload").on("change", function (e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      $("img.profile-picture").attr("src", e.target.result);
      console.log(e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please select a valid image file.");
  }
});
