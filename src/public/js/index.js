// ------------Block of function for Login Page---------------------
const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

let passwordVisible = false;

function togglePasswordVisibility() {
  $("#inputPassword").attr("type", passwordVisible ? "password" : "text");
  passwordVisible = !passwordVisible;
}

function handleInputBlur(input, alertSelector, validationFunc = null) {
  const value = input.val();
  const alertMessage =
    value === ""
      ? "Cannot leave this field blank!"
      : validationFunc && !validationFunc(value)
      ? "Provide a valid email address"
      : "";
  $(alertSelector).text(alertMessage);
}

function toggleSubmitButton() {
  const isEmailValid =
    $("#inputEmail").val() !== "" && isValidEmail($("#inputEmail").val());
  const isPasswordValid = $("#inputPassword").val() !== "";
  $("#submitbtn").prop("disabled", !(isEmailValid && isPasswordValid));
}

$("#inputEmail").on("blur", function () {
  handleInputBlur($(this), ".login-intranet .emailalert", isValidEmail);
});

$("#inputPassword").on("blur", function () {
  handleInputBlur($(this), ".login-intranet .passwordalert");
  toggleSubmitButton();
});

$("#inputPassword").on("keypress", function (e) {
  if (e.key === "Enter") {
    toggleSubmitButton();
    if (!$("#submitbtn").prop("disabled")) {
      $(".login-intranet form").submit();
    }
  }
});
$("#inputEmail, #inputPassword").on("focus", function () {
  $(this).siblings(".emailalert, .passwordalert").text("");
});
$("#inputShowPassword").on("click", togglePasswordVisibility);
$("#inputEmail").on("blur", () => toggleSubmitButton());
$("#inputPassword").on("blur", () => toggleSubmitButton());

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
    }).then((respone) => {
      if (!respone.ok) {
        throw new Error("error");
      } else {
        console.log(respone.text());
        window.location.href = "/homepage";
      }
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

// manage posts
var deletePicArray = [];
var editContentJson = [];

function getRowElements(obj) {
  const row = $(obj).closest("tr");
  return {
    id: row.find("td.newId"),
    content: row.find("td.content"),
    title: row.find("td.title"),
    imageContainer: row.find("td.image_container"),
    dateTime: row.find("td.date_time"),
  };
}

$(".manage-posts .table-group-divider .editBtn").on("click", function () {
  const button = $(this);
  const isEditing = button.html() === "Edit";
  const isSaving = button.html() === "Save";
  if (isEditing) {
    changeEditBtn(button, "btn-primary", "btn-success", "Save", 1);
    editContentTitle(button);
  } else if (isSaving) {
    changeEditBtn(button, "btn-success", "btn-primary", "Edit", 0);
    saveContentTitle(button);
    pushOrUpdate(editContentJson, generateJsonForEdit(button));
    console.log(editContentJson);
  }
});

$(".manage-posts .table-group-divider .image_container .closeBtn").on(
  "click",
  function () {
    const closeBtn = $(this);
    const input = closeBtn.siblings("input");
    const isChecked = input.prop("checked");

    if (isChecked) {
      input.prop("checked", false);
      deletePicArray = deletePicArray.filter(
        (f) => f.get(0) !== closeBtn.parent().get(0)
      );
      resetCloseBtnStyles(closeBtn);
      enableModal(closeBtn);
    } else {
      input.prop("checked", true);
      deletePicArray.push(closeBtn.parent());
      highlightCloseBtn(closeBtn);
      enableModal(closeBtn);
      deletePicWithModal();
    }
  }
);

$(".manage-posts .modal_formanagePost .cancelBtn_for_managePost").on(
  "click",
  function () {
    deletePicArray.forEach((f) =>
      resetCloseBtnStyles($(f).children(".closeBtn"))
    );
    deletePicArray = [];
    $(this).parents(".modal_formanagePost").fadeOut();
  }
);

$(".manage-posts > div > div > .update_manage").on("click", function () {
  const isContainEditData = editContentJson.length;

  if (!isContainEditData) {
    return;
  }
  const dataJson = JSON.stringify(editContentJson);
  console.log(dataJson);
  fetch("manage/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dạng JSON
    },
    body: dataJson,
  })
    .then((response) => response.text()) // Xử lý phản hồi (nếu có)
    .then((data) => console.log(data)) // In kết quả trả về từ server
    .catch((error) => console.error("Error:", error)); // Xử lý lỗi
});
function pushOrUpdate(array, newObj) {
  const index = array.findIndex((item) => item.id === newObj.id);
  if (index !== -1) {
    array[index] = newObj;
  } else {
    array.push(newObj);
  }
}

function deletePicWithModal() {
  $(".manage-posts .modal_formanagePost .yesBtn_for_managePost").on(
    "click",
    function () {
      deletePicArray.forEach((f) => $(f).remove());
      deletePicArray = [];
      $(".manage-posts .modal_formanagePost").fadeOut();
    }
  );
}

function enableModal(obj) {
  const modal = $(".manage-posts .modal_formanagePost");
  const { top, left } = $(obj).offset();
  const numberOfPictures = deletePicArray.length;
  const windowWidth = $(window).width();

  modal.css({
    left: windowWidth / 3,
    top: top - 90,
  });

  modal
    .find(".btn_container .textss")
    .text(
      `Choose ${numberOfPictures} picture${numberOfPictures > 1 ? "s" : ""}`
    );
  modal.fadeIn();
}

function changeEditBtn(button, prevClass, newClass, innerText, opacity) {
  const { imageContainer, id } = getRowElements(button);
  id.css({
    "background-color": opacity ? "#60a5fa" : "",
    color: opacity ? "white" : "",
  });
  imageContainer.find(".closeBtn").css("opacity", opacity);
  imageContainer.find(".addPic").css("opacity", opacity);

  button.removeClass(prevClass).addClass(newClass).html(innerText);
}

function editContentTitle(button) {
  const { content, title } = getRowElements(button);
  content.html(
    `<textarea style="width:100% ; height:${content.height()}px">${content.text()}</textarea>`
  );
  title.html(
    `<textarea style="width:100% ; height:${title.height()}px">${title.text()}</textarea>`
  );
}

function saveContentTitle(button) {
  const { content, title } = getRowElements(button);
  const innerContent = content.children().val();
  const innerTitle = title.children().val();

  content.text(innerContent);
  title.text(innerTitle);
}

function generateJsonForEdit(button) {
  const { title, content, dateTime, imageContainer } = getRowElements(button);
  const contentId = dateTime.find("div").text().trim();
  const userName = $(
    ".header-ỉntranet nav.navbar div.offcanvas ul.navbar-nav a.nav-link > span.ps-2"
  ).text();
  console.log(userName);
  const images = imageContainer
    .find("img")
    .map((i, img) => $(img).attr("src"))
    .get();

  return {
    id_content: contentId,
    title: title.text(),
    content: content.html(),
    image: images,
    poster: userName,
  };
}

function resetCloseBtnStyles(btn) {
  btn.removeAttr("style").attr("opacity", 1);
}

function highlightCloseBtn(btn) {
  btn.css({ "background-color": "#007bff", padding: "10px" });
}

function extracDate(value) {
  // Chuỗi ngày giờ
  const dateStr = value.trim();

  // Chuyển chuỗi thành đối tượng Date
  const dateObj = new Date(dateStr);

  // Lấy các phần của ngày giờ
  const day = dateObj.getDate(); // Ngày
  const month = dateObj.getMonth() + 1; // Tháng (bắt đầu từ 0, nên cộng thêm 1)
  const year = dateObj.getFullYear(); // Năm
  const hours = dateObj.getHours(); // Giờ
  const minutes = dateObj.getMinutes(); // Phút
  const seconds = dateObj.getSeconds(); // Giây

  // Định dạng lại thành chuỗi ngày, tháng, năm, giờ, phút, giây
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  console.log(formattedDate); // Ví dụ: "19/11/2024 16:19:16"
}
// ------------------------------------------------------

// ---------------------------------------------------
// viewspage picture
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
