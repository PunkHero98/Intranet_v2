var Imgsarray = [];
var ImageAfterDelete = [];
var latestArray = [];
$(".create-content-intranet .fourth-row input").on("change", function (e) {
  handleChoosePicture(e);
  displayImage(this);
});
function displayImage(obj) {
  const imgElements = Imgsarray.map((f, index) => {
    if (f && f instanceof File) {
      const imgElement = `
        <div class="small-img-container" data-index="${index}">
          <img src="${URL.createObjectURL(f)}" id="added-picture-${
        index + 1
      }" />
          <button type="button" class="btn btn-outline-danger rounded-0 m-0 added-pic-x delete-${
            index + 1
          }">
            <i class="fa-solid fa-x"></i>
          </button>
        </div>`;
      return imgElement;
    }
    return "";
  });
  const imgContainer = $($(obj).next());
  imgContainer.empty();
  imgContainer.append(imgElements.join(""));
}

function handleChoosePicture(event) {
  $($(".create-content-intranet .fourth-row input").next()).css(
    "display",
    "flex"
  );
  Imgsarray = [];

  const files = event.target.files;
  const filesArray = Array.prototype.slice.call(files);
  filesArray.forEach((f) => {
    if (!f.type.match("image.*")) {
      alert("Image only");
      return;
    }
    Imgsarray.push(f);
  });
  if (Imgsarray.length > 6) {
    Imgsarray = Imgsarray.slice(0, 6);
  }
}
$(".create-content-intranet .fourth-row label").on("click", function () {
  Imgsarray = [];
  $(".create-content-intranet .fourth-row .img-container")
    .empty()
    .css("display", "none");
  const fileInput = document.getElementById("Upload");
  fileInput.value = "";
});

$(".create-content-intranet").on(
  "click",
  ".img-container .small-img-container .added-pic-x",
  function () {
    const id = $(this).parent().attr("data-index");
    Imgsarray.splice(id, 1);
    $(this).parent().remove();
    restructureTabindex();
  }
);

function restructureTabindex(index) {
  const array = [];
  const image_container = $(
    ".create-content-intranet .fourth-row .img-container .small-img-container"
  );

  image_container.each(function () {
    array.push($(this));
  });
  array.forEach((f, num) => {
    f.attr("data-index", num);
  });
}

// sort function for add-news
$(".create-content-intranet .fourth-row .img-container").sortable({
  update: function (event, ui) {
    const neworder = $(this).sortable("toArray", { attribute: "data-index" });
    Imgsarray = neworder.map((index) => Imgsarray[parseInt(index)]);
    displayImage($(".create-content-intranet .fourth-row input"));
  },
});
// review function
$(".review-content-intranet .col-12 > div  .closeBtn").on("click", function () {
  $(this).parents(".review-content-intranet").css("display", "none");
  $("body").css("overflow-y", "initial");
});
$('.create-content-intranet .last-row input[value="Review"]').on(
  "click",
  function (e) {
    $(".review-content-intranet").css("display", "block");
    $("body").css("overflow-y", "hidden");
    const title = $(".create-content-intranet #title-input").val().trim();
    const content = quill.root.innerHTML;
    const reviewModal = $(".review-content-intranet .slideshow-container");
    const review = $(".review-content-intranet .col-12");
    review.children("h5").text(title);
    console.log(content);
    review.children(".content_area_for_review").html(content);
    reviewModal.children().not("a").remove();
    review.children(".text-center").empty();
    const imgLength = Imgsarray.length;
    const upperImageElements = Imgsarray.map((f, index) => {
      return `<div class="mySlides">
                <div class="numbertext text-body-tertiary">
                  ${index + 1}
                  /${imgLength}</div>
                <div class="d-flex justify-content-center"><img src=${URL.createObjectURL(
                  f
                )} /></div>
              </div>`;
    });
    const lowerImageElements = Imgsarray.map((f, index) => {
      return `<span
                class="dot"
                onclick="currentSlide(${index + 1})"
              ></span>
              `;
    });
    reviewModal.children(".prev").before(upperImageElements.join(""));
    review.children(".text-center").append(lowerImageElements.join(""));
    e.preventDefault();
    showSlides1(1);
  }
);
// ----------------------------------------------------

// submit function

$(".create-content-intranet .create-content-box #uploadform").on(
  "submit",
  async function (event) {
    event.preventDefault();
    const title = $(".create-content-intranet .first-row input").val();
    const textcontent = $(
      ".create-content-intranet .third-row #quill-editor-content textarea"
    );
    textcontent.value = JSON.stringify(quill.root.innerHTML);

    if (Imgsarray.length === 0) {
      alert("Please choose at least 1 picture");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("textcontent", textcontent.value);
    Imgsarray.forEach((image, index) => {
      formData.append("Imgfiles", image);
    });

    try {
      const response = await fetch("http://localhost:3000/content/add", {
        // const response = await fetch("https://5843-118-69-122-202.ngrok-free.app/content/add", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error submitting form");
      }
      const responseText = await response.text();
      console.log(responseText);
      window.location.href = "/homepage";
      Imgsarray = [];
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  }
);

let slideIndex1 = 1;
showSlides1(slideIndex1);

// Next/previous controls
function plusSlides1(n) {
  showSlides1((slideIndex1 += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides1((slideIndex1 = n));
}

function showSlides1(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex1 = 1;
  }
  if (n < 1) {
    slideIndex1 = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace("activePic", "");
  }
  slides[slideIndex1 - 1].style.display = "block";
  dots[slideIndex1 - 1].className += " activePic";
}
