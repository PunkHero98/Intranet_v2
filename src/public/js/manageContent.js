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
  const contentValue = content.html();
  content.html(
    `<div id="quill-editor-content" class="bg-white">
            <textarea
              style="width:100%;"
              class="input-box border-0"
              name="text_content"
              id="content-area"
              placeholder="Write something.."
            ></textarea>
          </div>`
  );

  const quill = new Quill("#quill-editor-content", {
    theme: "snow",
    placeholder: "Write something..",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ align: [] }, { color: [] }, { background: [] }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["clean"],
      ],
    },
  });
  quill.clipboard.dangerouslyPasteHTML(contentValue);
  content.children(".ql-toolbar").css("padding", "0");
  const toolbarHeight = content.children(".ql-toolbar").height();
  const quillHeight = quill.root.offsetHeight;
  const finalHeight = toolbarHeight + quillHeight;
  title.html(
    `<textarea style="width:100%; height:${finalHeight}px; background:white;">${title.text()}</textarea>`
  );
}

function saveContentTitle(button) {
  const { content, title } = getRowElements(button);
  const quill = new Quill("#quill-editor-content");
  const innerContent = quill.root.innerHTML;
  const innerTitle = title.children().val();
  content.html(innerContent);
  title.text(innerTitle);
}

function generateJsonForEdit(button) {
  const { title, content, dateTime, imageContainer } = getRowElements(button);
  const contentId = dateTime.find("div").text().trim();

  const contentNew = JSON.stringify(content.html());
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
    content: contentNew,
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
