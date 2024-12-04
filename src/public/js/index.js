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

// ---------------Choose Picture function---------------

var Imgsarray = [];

$(".create-content-intranet .fourth-row input").on("change", function (e) {
  handleChoosePicture(e);
  const imgElements = Imgsarray.map((f, index) => {
    const imgElement = `<img src="${URL.createObjectURL(
      f
    )}" id="added-picture-${index}" />`;
    return imgElement;
  });
  const imgContainer = $($(this).next());
  imgContainer.empty();
  imgContainer.append(imgElements.join(""));
});

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
}
$(".create-content-intranet .fourth-row label").on("click", function () {
  Imgsarray = [];
  $(".create-content-intranet .fourth-row .img-container")
    .empty()
    .css("display", "none");
  const fileInput = document.getElementById("Upload");
  fileInput.value = "";
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

$(".create-content-intranet .create-content-box #uploadform").on(
  "submit",
  async function (event) {
    event.preventDefault();

    const title = $(".create-content-intranet .first-row input").val();
    const textcontent = $(".create-content-intranet .third-row textarea").val();
    if (Imgsarray.length === 0) {
      alert("Please choose at least 1 picture");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("textcontent", textcontent);
    Imgsarray.forEach((image, index) => {
      formData.append("Imgfiles", image);
    });

    try {
      const response = await fetch("http://localhost:3000/content/add", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error submitting form");
      }
      const responseText = await response.text();
      console.log(responseText);
      window.location.href = "/homepage";
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  }
);

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
$(".manage-posts").on("click", ".table-group-divider .editBtn", function () {
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
    check_update();
    console.log(editContentJson);
  }
});

$(".manage-posts").on("click", ".image_container .closeBtn", function () {
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
});
// ------------
$(".manage-posts").on("click", ".image_container .addPic", function () {
  const addPicBtn = $(this);
  const input = addPicBtn.siblings("input.fileListForManage");
  input.click();

  input.change((e) => {
    handleChoosePicture(e);
    const numberOfItems = $(this).siblings(".img-box").length;
    const imgElements = Imgsarray.map((f, index) => {
      const imgElement = `
      <div class="img-box container-${index + numberOfItems + 1}">
                  <img src=${URL.createObjectURL(f)} alt="" />
                  <button
                    type="button"
                    class="btn btn-outline-danger closeBtn rounded-0 m-0"
                    style="opacity: 0"
                  >
                    <i class="fa-solid fa-x text-white"></i>
                  </button>

                  <input
                    id="stateCheck-${index + numberOfItems + 1}"
                    type="checkbox"
                    style="display: none"
                  />
                </div>`;
      return imgElement;
    });
    $(this).before(imgElements.join(""));
  });
});
// --------------
$(".manage-posts").on(
  "click",
  ".modal_formanagePost .cancelBtn_for_managePost",
  function () {
    deletePicArray.forEach((f) =>
      resetCloseBtnStyles($(f).children(".closeBtn"))
    );
    deletePicArray = [];
    $(this).parents(".modal_formanagePost").fadeOut();
  }
);

$(".manage-posts").on("click", ".update_manage", async function () {
  try {
    if (!editContentJson.length) return;

    const dataJson = JSON.stringify(editContentJson);
    console.log(dataJson);
    const windowHeight = $(window).height();

    $(".loader").css({
      display: "block",
      top: windowHeight / 3,
    });
    $(".manage-posts").css({
      filter: "blur(5px)",
      "background-color": "grey",
    });
    const result = await fetch("manage/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: dataJson,
    });
    const data = await result.text();
    setInterval(() => {
      window.location.href = "/manage";
    }, 3000);
  } catch (err) {
    $(".loader").css({
      display: "none",
    });
    $(".manage-posts").css({
      filter: "",
      "background-color": "",
    });
    console.log("error fetching data: ", err);
  }
});

function check_update(obj) {
  const isContainEditData = editContentJson.length;

  if (!isContainEditData) {
    return;
  }
  $(".manage-posts > div > div > .update_manage").removeAttr("disabled");
}

function pushOrUpdate(array, newObj) {
  const index = array.findIndex(
    (item) => item.id_content === newObj.id_content
  );
  if (index !== -1) array[index] = newObj;
  else array.push(newObj);
}

function deletePicWithModal() {
  $(".manage-posts").on(
    "click",
    ".modal_formanagePost .yesBtn_for_managePost",
    function () {
      deletePicArray.forEach((f) => $(f).remove());
      deletePicArray = [];
      $(".manage-posts .modal_formanagePost").fadeOut();
    }
  );
}

function enableModal(obj) {
  const modal = $(".modal_formanagePost");
  const { top, left } = $(obj).offset();
  const numberOfPictures = deletePicArray.length;
  const windowWidth = $(window).width();

  // modal.css({ left: windowWidth / 3, top: top - 90 });
  modal.css({top: top});

  const body = $(".manage-posts");
  body.css({opacity: '0.8', 'background-color': 'rgba(0,0,0,0.1)'});

  modal
    .find("p")
    .text(
      `Are you sure want to delete ${
        numberOfPictures > 1
          ? `these ${numberOfPictures} picturtes`
          : "this picture"
      }`
    );

  modal.fadeIn();
}

function changeEditBtn(button, prevClass, newClass, innerText, opacity) {
  const { imageContainer, id } = getRowElements(button);
  $(button)
    .parents("tr")
    .css({
      "background-color": opacity ? "#00000010" : "",
    });
  imageContainer.find(".closeBtn").css("opacity", opacity);
  imageContainer.find(".addPic").css("display", opacity ? "block" : "none");
  button.removeClass(prevClass).addClass(newClass).html(innerText);
}

function editContentTitle(button) {
  const { content, title } = getRowElements(button);
  const contentHeight = content.height();
  const titleHeight = title.height();
  const maxHeight = Math.max(contentHeight, titleHeight);
  content.html(
    `<textarea style="width:100%; height:${maxHeight}px; background:transparent;">${content.text()}</textarea>`
  );
  title.html(
    `<textarea style="width:100%; height:${maxHeight}px; background:transparent;">${title.text()}</textarea>`
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

  const newdatetime = dateTime
    .contents()
    .filter(function () {
      return this.nodeType === 3;
    })
    .text();
  const anotherdatetime = extracDate(newdatetime);

  const images = imageContainer
    .find("img")
    .map((i, img) => $(img).attr("src"))
    .get();
  const timenow = getDate();
  const images_link = images[0].split("\\")[1];
  const content_images = images.map((item) => {
    const parts = item.split("\\");
    return parts[parts.length - 1];
  });
  return {
    id_content: contentId,
    title: title.text(),
    content: content.html(),
    images_link: images_link,
    content_images: content_images,
    poster: "",
    date_time: anotherdatetime,
    last_updated: timenow,
    deleted: 0,
    poster_site: "string",
  };
}

function resetCloseBtnStyles(btn) {
  btn.removeAttr("style").attr("opacity", 1);
}

function highlightCloseBtn(btn) {
  btn.css({ "background-color": "#dc3545" });
}

function extracDate(value) {
  const dateObj = new Date(value.trim());
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function getDate() {
  const now = new Date();
  return `${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
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
