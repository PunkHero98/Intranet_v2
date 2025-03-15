let Imgsarray = [];
let FileArray = [];
let ImageAfterDelete = [];
let latestArray = [];
const HTTP_Request_address = "http://localhost:3000";
$(".create-content-intranet .fourth-row #Upload").on("change", function (e) {
  handleChoosePicture(e);
  displayImage();
});

$(".add-Btn").css("display", "none");

function displayImage() {
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
  const imgContainer = $(".create-content-intranet .fourth-row .img-container");
  imgContainer.empty();
  imgContainer.append(imgElements.join(""));
}

function displayFileInfo() {
  const fileElements = FileArray.map((f, index) => {
    if (f && f instanceof File) {
      // 📝 Lấy thông tin file
      const fileName = f.name;
      const fileSize = (f.size / 1024).toFixed(2) + " KB"; // Chuyển byte -> KB
      const fileType = f.type || "Unknown"; // Một số file không có type
      
      // 🏷 Tạo div chứa thông tin file
      const fileElement = `
        <div class="file-info-container shadow bg-light rounded " data-index="${index}">
        <i class="fa-solid fa-file"></i>
          <p class="m-0 " title=${fileName}><strong>Name:</strong> ${fileName}</p>
          <p class="m-0" title="${fileSize}"><strong>Size:</strong> ${fileSize}</p>
          <p class="m-0" title=${fileType}><strong>Type:</strong> ${fileType}</p>
          <button class="btn btn-danger fs-6 deleteFileBtn"><i class="fa-solid fa-xmark"></i></i></button>
        </div>`;
      
      return fileElement;
    }
    return "";
  });

  const fileContainer = $(".create-content-intranet .fourth-row .file-container");
  fileContainer.empty();
  fileContainer.append(fileElements.join(""));
}

$('.create-content-intranet .fourth-row .file-container').on("click", "button", function () {
  const index = $(this).parent().attr("data-index");
  FileArray.splice(index, 1);
  displayFileInfo();
});

function handleChoosePicture(event) {
  $($(".create-content-intranet .fourth-row #Upload").next()).css(
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
  if (Imgsarray.length > 10) {
    Imgsarray = Imgsarray.slice(0, 10);
  }
  console.log(Imgsarray);
}
$(".create-content-intranet .fourth-row .clearBtn").on("click", function () {
  Imgsarray = [];
  FileArray = [];
  $(".create-content-intranet .fourth-row .img-container")
    .empty()
    .css("display", "none");
  
  $(".create-content-intranet .fourth-row .file-container")
    .empty()
    .css("display", "none");
  const fileInput = document.getElementById("uploadFile");
  fileInput.value = "";
  const photoInput = document.getElementById("Upload");
  photoInput.value = "";
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

$('.create-content-intranet .fourth-row #uploadFile').on("change", function (e) {
  const files = e.target.files;
  const allowedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"];
  const maxSize = 5 * 1024 * 1024;
  if(FileArray.length > 3 || files.length > 3) {
    console.log(FileArray.length);
    showNotification("Error ", "You can only upload 3 files at a time", "alert-success", "alert-danger");
    e.target.value = "";
    return;
  }
  for (let i = 0; i < files.length; i++) {
    const fileExtension = files[i].name.slice(files[i].name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      // alert(`File ${files[i].name} is an unauthorized type!`);
      showNotification("Error ", `File is ${files[i].name} an unauthorized type!`, "alert-success", "alert-danger");
      e.target.value = ""; // Xóa file đã chọn
      return;
  }
    if (files[i].size > maxSize) {
      // alert(`File ${files[i].name} size exceeds 5MB`);
      showNotification("Error ", `File ${files[i].name} size exceeds 5MB`, "alert-success", "alert-danger");
      e.target.value = "";
      return;
    }
    FileArray.push(files[i]);
  };
  displayFileInfo();
});

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

    // if (Imgsarray.length === 0) {
    //   alert("Please choose at least 1 picture");
    //   return;
    // }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("textcontent", textcontent.value);
    Imgsarray.forEach((image, index) => {
      formData.append("Imgfiles", image);
    });
    FileArray.forEach((file, index) => {
      formData.append("Docfiles", file);
    });
    try {
      $('.loader').css('display', 'block');
      $('.create-content-intranet').css({opacity: 0.05 , pointerEvents: 'none' , userSelect: 'none' , backgroundColor: 'rgba(0, 0, 0, 0.65)'});
      const response = await fetch(`${HTTP_Request_address}/content/add`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        $('.loader').css('display', 'none');
        $('.create-content-intranet').css({opacity: 1 , pointerEvents: 'auto' , userSelect: 'auto' , backgroundColor: 'rgba(0, 0, 0, 0)'});
        showNotification("Error ", "There was an error submitting the form. Please try again.", "alert-success", "alert-danger");
        throw new Error("Error submitting form");
      }
      $('.loader').css('display', 'none');
      $('.create-content-intranet').css({opacity: 1 , pointerEvents: 'auto' , userSelect: 'auto' , backgroundColor: 'rgba(0, 0, 0, 0)'});
      showNotification("Success ", "Your content has been submitted successfully", "alert-danger", "alert-success");
      clearInput();
      setTimeout(() => {
        window.location.href = "/homepage";
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  }
);

// BackBtn function
$("button.backButton").on("click", function () {
  window.history.back();
});

$("input.cancelButton").on("click", function () {
  window.location.href = "/homepage";
});

function clearInput () {
  Imgsarray = [];
  FileArray = [];
  $(".create-content-intranet .fourth-row .img-container")
    .empty()
    .css("display", "none");
  $(".create-content-intranet .fourth-row .file-container")
    .empty()
    .css("display", "none");
  const fileInput = $("#uploadFile");
  fileInput.value = "";
  const photoInput = $("#Upload");
  photoInput.value = "";
  quill.root.innerHTML = "";
  $(".create-content-intranet .first-row input").val("");
};

function showNotification(noti, html, removeClass, addClass) {
  $(".alert-intranet").css("display", "block").css("opacity", "1");
  $(".alert-intranet strong").html(noti);
  $(".alert-intranet span").html(html);
  $(".alert-intranet").removeClass(removeClass).addClass(addClass);

  // Tự động ẩn thông báo sau 3 giây
  setTimeout(() => {
    $(".alert-intranet").css("opacity", "0");
    setTimeout(() => {
      $(".alert-intranet").css("display", "none");
    }, 500); // Đợi transition hoàn tất
  }, 3000);
}


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
