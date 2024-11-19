// ------------Block of function for Login Page---------------------
var i = true;
$("#inputEmail").on("blur", function () {
  if ($(this).val() == "") {
    $(".login-intranet .emailalert").text("Cannot leave this field blank!");
  } else if (!isValidEmail($(this).val())) {
    $(".login-intranet .emailalert ").text("Provide a valid email address");
  }
});

$("#inputPassword").on("blur", function () {
  if ($(this).val() == "") {
    $(".login-intranet .passwordalert").text("Cannot leave this field blank!");
  }
  if ($("#inputPassword").val() != "" && $("#inputEmail").val() != "") {
    $("#submitbtn").removeAttr("disabled");
  } else {
    $("#submitbtn").prop("disabled", true);
  }
});

$("#inputPassword").on("keypress", function (e) {
  if (e.key === "Enter") {
    if ($("#inputPassword").val() != "" && $("#inputEmail").val() != "") {
      $("#submitbtn").removeAttr("disabled");
      $(".login-intranet form").submit();
    }
  }
});
$("#inputEmail").on("focus", function () {
  $(".login-intranet .emailalert ").text("");
});

$("#inputPassword").on("focus", function () {
  $(".login-intranet .passwordalert ").text("");
});

$("#inputShowPassword").on("click", function () {
  passwordCheckBox();
});
function passwordCheckBox() {
  if (i) {
    $("#inputPassword").attr("type", "text");
    i = false;
  } else {
    $("#inputPassword").attr("type", "password");
    i = true;
  }
}
const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// ------------End Block function for Login Page---------------------

// ---------------Button on Home page------------------
$(".welcome-homepage .col-12 #TicketSystem").on("click", function () {
  window.open("https://helpdesk.qsl.support", "_blank");
});
$(".welcome-homepage .col-12 #team").on("click", function () {
  window.open("/teams", "_blank");
});

// -----------------------------------------------------

// ------------Block function for Activities Page---------------------

$(".activities-body .navbtn .navbtn-left").on("click", function () {
  const checkDeg = window.getComputedStyle(this, "::before").transform;
  if (
    checkDeg == "matrix(-0.707107, 0.707107, -0.707107, -0.707107, -2.82843, 0)"
  ) {
    $(this).css("--arrowAnimation", "rotate(224deg) translate(2px , 2px)");
  } else {
    $(this).css("--arrowAnimation", "rotate(135deg) translate(2px , 2px)");
  }
});

$(".activities-body .navbtn-right").on("click", function () {
  const checkDeg = window.getComputedStyle(this, "::before").transform;
  const checkDeg1 = window.getComputedStyle(this, "::after").transform;
  if (checkDeg == "matrix(1, 0, 0, 1, 2, 2)") {
    $(this).css("--beforeanimation", "rotate(180deg) translate(-8px , -8px)");
    $(this).css("--afteranimation", "rotate(180deg) translate(4px , 4px)");
    setTimeout(() => {
      $(this).css("--minus", "none");
    }, 100);
  }
  if (
    checkDeg == "matrix(-1, 0, 0, -1, 8, 8)" &&
    checkDeg1 == "matrix(-1, 0, 0, -1, -4, -4)"
  ) {
    $(this).css("--beforeanimation", "rotate(360deg) translate(2px , 2px)");
    $(this).css("--afteranimation", "rotate(360deg) translate(2px , 2px)");

    $(this).css("--minus", "2px solid #fff");
  }
  const xx = $(".create-content-box");
  if (xx.css("display") === "none") {
    xx.css("display", "block");
  } else {
    xx.css("display", "none");
  }
  // matrix(1, 0, 0, 1, 2, 2)
});
// -----------------------------------------------------

// ---------------Choose Picture function---------------
$(".activities-body .fourth-row input").on("change", function (e) {
  handleChoosePicture(e);
  console.log(e);
  Imgsarray.forEach((f, index) => {
    console.log(f);
    if (index === 0) {
      $($(this).next()).html(`<img src="" id="added-picture-${index}" />`);
    } else if (index >= 1 && index <= 5) {
      $($($(this).next()).children(`#added-picture-${index - 1}`)).after(
        `<img src="" id="added-picture-${index}" />`
      );
    }
    $($($(this).next()).children()[index]).attr("src", URL.createObjectURL(f));
  });
});

var Imgsarray = [];
function handleChoosePicture(event) {
  $($(".activities-body .fourth-row input").next()).css("display", "flex");
  Imgsarray = [];
  const files = event.target.files;
  console.log(files);
  const filesArray = Array.prototype.slice.call(files);
  filesArray.forEach((f, index) => {
    if (!f.type.match("image.*")) {
      return alert("image only");
    }
    // $($(".activities-body .fourth-row  input").next()).css(
    //   "display",
    //   "block"
    // );
    Imgsarray.push(f);
  });
}
// ----------------------------------------------------

// clear picture function
$(".activities-body .last-row  button").on("click", function (e) {
  Imgsarray = [];
  $(".activities-body .fourth-row  .img-container").html("");
  $(".modal-news .modal-body .col-4").html("");
  $(".activities-body .fourth-row  .img-container").css("display", "none");
  const fileInput = document.getElementById("Upload");
  fileInput.value = "";
  e.preventDefault();
});
// ----------------------------------------------------

// review function
$('.activities-body .last-row input[type="button"]').on("click", function (e) {
  bindingContentandTitle();

  Imgsarray.forEach((f, index) => {
    if (index === 0) {
      $(".modal-news .modal-body .col-4 .button.row").before(
        `<img src="" class="first-imgs" id="modal-added-picture-${index}" />`
      );
      $(".modal-news .modal-body .col-4 .button.row").after(`
        <div class="row-thumbnail">
        <div class="column-${index}"><img src="" onclick="currentSlide(${
        index + 1
      })" id="thumbnail-pictured-${index}"/></div>
        </div>`);
    } else if (index >= 1 && index <= 5) {
      $(
        `.modal-news .modal-body .col-4 #modal-added-picture-${index - 1}`
      ).after(
        `<img src="" class="first-imgs" id="modal-added-picture-${index}" />`
      );
      $(`.modal-news .modal-body .col-4 .column-${index - 1}`).after(
        `<div class="column-${index}"><img src="" onclick="currentSlide(${
          index + 1
        })" id="thumbnail-pictured-${index}"/></div>`
      );
    }
    $($(`.modal-news .modal-body .col-4 img`)[index]).attr(
      "src",
      URL.createObjectURL(f)
    );
    $(`.modal-news .modal-body .col-4 #thumbnail-pictured-${index}`).attr(
      "src",
      URL.createObjectURL(f)
    );
  });
  e.preventDefault();
});

function bindingContentandTitle() {
  const title = $("#title-input").val();
  const content = $(".activities-body .third-row textarea").val();
  let first;
  if (!Imgsarray.length == 0) {
    $(".modal-news .modal-body .col-4").html(
      '<div class="button row"><span onclick="plusSlides(-1)" class="prev"></span><span onclick="plusSlides(1)" class="next"></span></div>'
    );
  }
  $(".modal-news .modal-body .col-8").children("h5").text(title);
  $(".modal-news .modal-body .col-8").children("p").text(content);
}
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = $(".modal-news .modal-content .modal-body .col-4 .first-imgs");
  let dots = $(
    ".modal-news .modal-content .modal-body .col-4 .row-thumbnail img"
  );
  let captionText = document.getElementById("caption");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    $(slides[i]).css("display", "none");
  }
  for (i = 0; i < dots.length; i++) {
    $(dots[i]).removeClass("active-modal");
  }
  $(slides[slideIndex - 1]).css("display", "block");
  $(dots[slideIndex - 1]).addClass("active-modal");
  // captionText.innerHTML = dots[slideIndex - 1].alt;
}

// ----------------------------------------------------

// submit function
$(".activities-body .create-content-box  #uploadform").on(
  "submit",
  async function (event) {
    event.preventDefault();
    const title = $(".activities-body .first-row input").val();
    const textcontent = $(".activities-body .third-row textarea").val();

    if (Imgsarray.length === 0) {
      alert("Please Chose at least 1 picture");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("textcontent", textcontent);
    for (let i = 0; i < Imgsarray.length; i++) {
      formData.append("Imgfiles", Imgsarray[i]);
    }
    fetch("content/add", {
      method: "POST",
      body: formData,
    })
      .then((respone) => {
        if (!respone.ok) {
          throw new Error("error");
        }
        return respone.text();
      })
      .then((text) => {
        console.log(text);
      });
  }
);

// ----------------------------------------------------

// Profile page

// $(".profile .card").on("click", function () {
//   $(".profile .card .card-body .rounded-circle").attr(
//     "src",
//     URL.createObjectURL("/C:/img/1725579110148.jpg")
//   );
// });
// ----------------------------------------------------
