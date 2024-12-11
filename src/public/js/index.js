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
// ----------------------------------------------------

// review function
$(".review-content-intranet .col-12 > div  .closeBtn").on("click", function () {
  $(this).parents(".review-content-intranet").css("display", "none");
  $("body").css("overflow-y", "initial")
});
$('.create-content-intranet .last-row input[value="Review"]').on(
  "click",
  function (e) {
    $(".review-content-intranet").css("display", "block");
    $("body").css("overflow-y", "hidden")
    const title = $(".create-content-intranet #title-input").val().trim();
    const content = $(".create-content-intranet #content-area").val().trim();
    const reviewModal = $(".review-content-intranet .slideshow-container");
    const review = $(".review-content-intranet .col-12");
    review.children("h5").text(title);
    review.children("p").text(content);
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
    textcontent.value = JSON.stringify(quill.root.innerHTML.trim());

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
    contentStage: row.find("td.content_stage"),
  };
}

$(".manage-posts").on(
  "click",
  ".table-group-divider .editBtn",
  async function () {
    const button = $(this);
    const isEditing = button.html() === "Edit";
    const isSaving = button.html() === "Save";

    if (isEditing) {
      changeEditBtn(button, "btn-primary", "btn-success", "Save", 1);
      editContentTitle(button);
    } else if (isSaving) {
      changeEditBtn(button, "btn-success", "btn-primary", "Edit", 0);
      saveContentTitle(button);
      await pushNewPicToServer(button);
      pushOrUpdate(editContentJson, generateJsonForEdit(button));
      check_update();
      console.log(editContentJson);
    }
  }
);

$(".manage-posts").on("click", ".image_container .closeBtn", function () {
  const closeBtn = $(this);
  const input = closeBtn.siblings("input");
  const isChecked = input.prop("checked");
  const parent = closeBtn.parent();
  if (isChecked) {
    input.prop("checked", false);
    deletePicArray = deletePicArray.filter((f) => f.get(0) !== parent.get(0));
    resetCloseBtnStyles(closeBtn);
    enableModal(closeBtn);
  } else {
    input.prop("checked", true);
    deletePicArray.push(parent);
    highlightCloseBtn(closeBtn);
    enableModal(closeBtn);
    deletePicWithModal();
  }
});

// --------------
$(".manage-posts").on("click", ".image_container .addPic", function () {
  const addPicBtn = $(this);
  const input = addPicBtn.siblings("input.fileListForManage");
  const lengthofImage = addPicBtn.parent().children(".img-box").length;
  console.log(lengthofImage);
  if (lengthofImage >= 6) {
    $(".alert-intranet").css("display", "block");
    $(".alert-intranet strong").html("Warning ! ");
    $(".alert-intranet span").html("Maximum number of pictures are 6.");
    $(".alert-intranet").removeClass("alert-success");
    $(".alert-intranet").addClass("alert-warning");
    return;
  }
  input.click();
  input.off("change").change((e) => {
    handleChoosePicture(e);
    const limitNum = Imgsarray.length + lengthofImage;
    if (limitNum > 6) {
      Imgsarray = Imgsarray.slice(0, 6 - lengthofImage);
    }
    const imgElements = Imgsarray.map((f, index) => {
      const imgElement = `
      <div class="img-box container-${index + lengthofImage + 1}">
        <img src=${URL.createObjectURL(f)} alt="" />
        <button
          type="button"
          class="btn btn-outline-danger closeBtn rounded-0 m-0"
          style="opacity: 1"
        >
          <i class="fa-solid fa-x text-white"></i>
        </button>
        <input
          id="stateCheck-${index + lengthofImage + 1}"
          type="checkbox"
          style="display: none"
        />
      </div>`;
      return imgElement;
    });
    addPicBtn.before(imgElements.join(""));
    input.val("");
  });
});
// ------------
$(".cancelBtn_for_managePost").on("click", function () {
  deletePicArray.forEach((f) =>
    resetCloseBtnStyles($(f).children(".closeBtn"))
  );
  deletePicArray = [];
  $(".closeBtn").siblings("input").prop("checked", false);
  $(this).parents(".modal_formanagePost").fadeOut();

  $(".manage-posts").css({
    "background-color": "",
    opacity: "",
  });
});

$(".manage-posts").on("click", ".update_manage", async function () {
  try {
    if (!editContentJson.length) return;

    const dataJson = JSON.stringify(editContentJson);
    console.log(dataJson);

    $(".loader").css({
      display: "block",
    });

    $(".manage-posts").css({
      filter: "blur(5px)",
    });

    $("body").css({
      "user-select": "none",
    });

    const result = await fetch("http://localhost:3000/manage/update", {
      // const result = await fetch("https://5843-118-69-122-202.ngrok-free.app/manage/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: dataJson,
    });

    const data = await result.text();
    setInterval(() => {
      $(".alert-intranet").css("display", "block");

      setInterval(() => {
        location.reload();
      }, 3000);
      $(".loader").css({
        display: "none",
      });

      $(".manage-posts").css({
        filter: "",
      });
    }, 1000);
  } catch (err) {
    $(".loader").css({
      display: "none",
    });
    $(".manage-posts").css({
      filter: "",
      "background-color": "",
    });
    $("body").css({
      "user-select": "",
    });
    console.log("error fetching data: ", err);
  }
});

// btn for deleted (not fully functional)
$(".manage-posts").on("click", ".btn-danger", function () {
  getRowElements(this).contentStage.html("deleted");
});

async function pushNewPicToServer(obj) {
  const { imageContainer } = getRowElements(obj);
  const afterEditImgArray = [];
  const childOfImageContainer = imageContainer.children("div");
  const numOfBasic = childOfImageContainer.children("img.basic_image").length;
  const numOfPic = childOfImageContainer.children("img").length;

  if (numOfPic > numOfBasic) {
    obj.html('<i class="fa fa-spinner fa-spin"></i>Saving');
    childOfImageContainer.children('img[src^="blob:"]').each(function () {
      afterEditImgArray.push($(this).attr("src"));
    });
    const basic_image = childOfImageContainer
      .children("img.basic_image")
      .attr("src")
      .split("\\")[1];
    const formData = new FormData();
    formData.append("imgFolderName", basic_image);

    try {
      const fetchPromises = afterEditImgArray.map((blobUrl, index) => {
        return fetch(blobUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], `image_${index + 1}.jpg`, {
              type: blob.type,
            });
            formData.append("Imgfiles", file);
          });
      });

      await Promise.all(fetchPromises);

      const response = await fetch(
        "http://localhost:3000/manage/add_news_pics",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      renderNewPic(obj, result, numOfBasic);
      setTimeout(() => {
        obj.html("Edit");
      }, 1000);
    } catch (err) {
      console.error("Error:", err);
      alert("There was an error submitting the form. Please try again.");
    }
  }
}

function renderNewPic(obj, json, piclength) {
  const { imageContainer } = getRowElements(obj);

  const basicImage = imageContainer
    .find("img.basic_image")
    .map((i, img) => $(img).attr("src"))
    .get();
  const content_images = basicImage.map((item) => {
    const parts = item.split("\\");
    return parts[parts.length - 1];
  });

  imageContainer
    .children("div")
    .children('img[src^="blob:"]')
    .parent()
    .remove();

  const addPic = imageContainer.children(".addPic");
  const images = JSON.parse(json[0].content_images);
  const set1 = new Set(content_images);
  const set2 = new Set(images);

  const diff1 = [...set1].filter((item) => !set2.has(item));
  const diff2 = [...set2].filter((item) => !set1.has(item));

  const result = [...diff1, ...diff2];

  const link = json[0].images_link;
  const imageElements = result.map((f, index) => {
    return `
      <div class="img-box container-${piclength + index + 1}">
        <img class="basic_image" src=\\${link}\\${f} alt="" />
        <button
          type="button"
          class="btn btn-outline-danger closeBtn rounded-0 m-0"
          style="opacity: 0"
        >
          <i class="fa-solid fa-x text-white"></i>
        </button>
        <input
          id="stateCheck-${piclength + index + 1}"
          type="checkbox"
          style="display: none"
        />
      </div>`;
  });

  addPic.before(imageElements.join(""));
}

function check_update() {
  if (editContentJson.length) {
    $(".manage-posts > div > div > .update_manage").removeAttr("disabled");
  }
}

function pushOrUpdate(array, newObj) {
  const index = array.findIndex(
    (item) => item.id_content === newObj.id_content
  );
  if (index !== -1) array[index] = newObj;
  else array.push(newObj);
}

function deletePicWithModal() {
  $(".yesBtn_for_managePost").on("click", function () {
    deletePicArray.forEach((f) => $(f).remove());
    deletePicArray = [];
    $(".modal_formanagePost").fadeOut();
    $(".manage-posts").css({
      "background-color": "",
      opacity: "",
    });
  });
}

function enableModal(obj) {
  const modal = $(".modal_formanagePost");
  const modalHeight = modal.height();
  const { top, left } = $(obj).offset();
  const numberOfPictures = deletePicArray.length;
  const calculatedTop = `calc(${top + modalHeight / 2}px + 1rem)`;

  modal.css({ top: calculatedTop });

  const bodynews = $(".manage-posts");
  bodynews.css({
    "background-color": "",
    opacity: "0.5",
  });

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
      "background-color": opacity ? "rgba(0, 0, 0, 0.063)" : "",
    });

  imageContainer.find(".closeBtn").css("opacity", opacity);
  imageContainer
    .find(".closeBtn")
    .prop("disabled", !imageContainer.find(".closeBtn").prop("disabled"));
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
    .find("img.basic_image")
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
