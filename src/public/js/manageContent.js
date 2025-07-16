// manage posts
let deletePicArray = [];
let editContentJson = [];
let dataArray = [];
let isEditVariable = null;
const HTTP_Request_address = window.location.origin;

$('document').ready(async function () {
  await fetchData();
}
);

$(".add-Btn").css("display", "none");

window.onbeforeunload = function (e) {
  if (isEditVariable) {
    const message = "You have unsaved changes. Are you sure you want to leave?";
    e.preventDefault();  // Một số trình duyệt yêu cầu dòng này
    e.returnValue = message;
    return message;
  }
};

$(document).on('click', '.toggle-images-btn', function () {
  const $btn = $(this);
  const $gallery = $btn.siblings('.image-gallery');

  $gallery.slideToggle(200, function () {
    // Chạy sau khi toggle hoàn tất
    const isVisible = $(this).is(':visible');
    $btn.text(isVisible ? 'Hide Pictures' : 'Show Pictures');
  });
});

$(document).on('click', '.toggle-files-btn', function () {
  const $btn = $(this);
  const $gallery = $btn.siblings('.file-gallery');

  $gallery.slideToggle(200, function () {
    // Chạy sau khi toggle hoàn tất
    const isVisible = $(this).is(':visible');
    $btn.text(isVisible ? 'Hide Files' : 'Show Files');
  });
});

// $(document).on('click', '.read-more-btn', function () {
//   const $btn = $(this);
//   const $content = $btn.siblings('.content-text');

//   $content.toggleClass('expanded');
//   $btn.text($content.hasClass('expanded') ? 'Show less' : 'Read more');
// });


async function fetchData() {
  try{
    const result = await fetch(`${HTTP_Request_address}/manage/getall`);
    if (!result.ok) {
      throw new Error("Network response was not ok");
    };
    dataArray = await result.json();
    console.log(dataArray)
    renderData();
  }catch(err){
    showNotification(
      "Error! ",
      "Error fetching data, please try again!",
      "alert-success",
      "alert-danger"
    );
  }
};

function renderData() {
  if(!dataArray.length) {
    showNotification(
      "Warning! No data found. ",
      "Please try again!",
      "alert-success",
      "alert-warning"
    );
    return;
  }
  const tableBody = $(".manage-posts table tbody");
  tableBody.empty();
  dataArray.forEach((item, index) => {
    const row = `
       <tr>
            <td class="newId">${index + 1}</td>
            <td class="title">${item.title}</td>
            <td class="content">
              <div class="content-wrapper">
                <div class="content-text">${item.content}</div>
              </div>
            </td>
            <td class="image_container">
             ${item.content_images && item.content_images.length > 0 ?
                `<button type="button" class="btn btn-sm btn-info toggle-images-btn mb-2">Show Pictures</button>` :
                `<button type="button" class="btn btn-sm btn-secondary toggle-images-btn mb-2" disabled>No Pictures</button>`}

              <div class="image-gallery" style="display: none;">
                ${item.content_images && item.content_images.length > 0 ? 
                  item.content_images.map((imgSrc, imgIndex) => `
                    <div class="img-box container-${imgIndex + 1}">
                      <img class="basic_image" src="${imgSrc}" alt="image" 
                          onerror="this.onerror=null; this.src='';" 
                           />
                      <button
                      type="button"
                      class="btn btn-outline-danger closeBtn rounded-0 m-0"
                      style="opacity: 0"
                      disabled
                    >
                      <i class="fa-solid fa-x text-white"></i>
                    </button>
                    <input id="stateCheck-${imgIndex + 1}" type="checkbox" style="display: none;  margin: 4px;" />
                    </div>
                  `).join("") 
                  : `<p>No images available.</p>`
                }
              </div>
              <button type="button" class="btn btn-outline-success addPic">
                <i class="fa-solid fa-plus"></i> Add more pictures
              </button>
              <input
                accept="image/jpeg, image/png, image/jpg, image/webp, image/heif, image/svg"
                style="display: none;"
                type="file"
                class="fileListForManage input-${index + 1}"
                multiple
              />
            </td>
            <td class="files">
              ${item.content_file.length ? `<button type="button" class="btn btn-sm btn-info toggle-files-btn mb-2">Show File</button>` : `<button type="button" class="btn btn-sm btn-secondary toggle-files-btn mb-2" disabled>No File</button>`}
               <div class="file-gallery" style="display: none;">
                ${checkFileExt(item.content_file , item.newContentFile)}
               </div>
            </td>
            <td class="date_time">${formatDate(item.date_time) || 'N/A'}
              <div style="display:none">
                ${item.id_content || ''}
              </div>
              <span style="display:none">${item.date_time}</span>
            </td>
            <td class="content_stage fs-6">
              ${!item.deleted ? '<span class="badge rounded-pill text-bg-success">Active</span>' : '<span class="badge rounded-pill text-bg-danger">Deactivate</span>'}</td>
            <td class="btn_container_table">
              <button type="button" class="btn btn-primary btn-sm editBtn d-flex">Edit</button>
              <button type="button" class="btn btn-danger deactivateBtn btn-sm" style="display: none">Deactivate</button>
              <button type="button" class="btn btn-success activateBtn btn-sm" style="display: none">Activate</button>
            </td>
          </tr>`;

    tableBody.prepend(row);
});
}

$('.manage-posts .refesh_manage').on('click' , function(){
  window.location.reload();
})

$('.manage-posts .search_input').on('keyup', function() {
  const searchValue = $(this).val().toLowerCase();
  const filteredData = dataArray.filter(item => {
    return item.title.toLowerCase().includes(searchValue) || 
           item.content.toLowerCase().includes(searchValue);
  });
  renderFilteredData(filteredData);
}
);

function checkFileExt(content_file, newContentFile) {
  if (!content_file.length) return '';

  let result = '';

  content_file.forEach((item, index) => {
    const fileName = newContentFile[index];
    const ext = fileName.split('.').pop().toLowerCase();

    let iconClass = 'fa-file'; // default icon

    switch (ext) {
      case 'pdf':
        iconClass = 'fa-file-pdf text-danger';
        break;
      case 'xls':
      case 'xlsx':
        iconClass = 'fa-file-excel text-success';
        break;
      case 'doc':
      case 'docx':
        iconClass = 'fa-file-word text-primary';
        break;
      case 'ppt':
      case 'pptx':
        iconClass = 'fa-file-powerpoint text-danger';
      default:
        iconClass = 'fa-file';
    }

    const fileRow = `
      <div class="file-box mb-1">
        <div class="file-info">
          <i class="fa-solid ${iconClass}" ></i>
          <span class="file-name" title="${fileName}">${item}</span>
        </div>
        <button class="delete-btn" onclick="alert('Xoá file!')">✕</button>
      </div>
    `;

    result += fileRow;
  });

  return result;
}


function renderFilteredData(filteredData) {
  const tableBody = $(".manage-posts table tbody");
  tableBody.empty();
  filteredData.forEach((item, index) => {
    const row = `
       <tr>
            <td class="newId">${index + 1}</td>
            <td class="title">${item.title}</td>
            <td class="content">
              <div class="content-wrapper">
                <div class="content-text">${item.content}</div>
              </div>
            </td>
            <td class="image_container">
               ${item.content_images && item.content_images.length > 0 ?
                `<button type="button" class="btn btn-sm btn-primary toggle-images-btn mb-2">Show Pictures</button>` :
                `<button type="button" class="btn btn-sm btn-secondary toggle-images-btn mb-2" disabled>No Pictures</button>`}

              <div class="image-gallery" style="display: none;">
                ${item.content_images && item.content_images.length > 0 ? 
                  item.content_images.map((imgSrc, imgIndex) => `
                    <div class="img-box container-${imgIndex + 1}">
                      <img class="basic_image" src="${imgSrc}" alt="image" 
                          onerror="this.onerror=null; this.src='';" 
                          style="max-width: 120px; margin: 4px;" />
                      <button
                      type="button"
                      class="btn btn-outline-danger closeBtn rounded-0 m-0"
                      style="opacity: 0"
                      disabled
                    >
                      <i class="fa-solid fa-x text-white"></i>
                    </button>
                    <input id="stateCheck-${imgIndex + 1}" type="checkbox" style="display: none" />
                    </div>
                  `).join("") 
                  : `<p>No images available.</p>`
                }
              </div>
              <button type="button" class="btn btn-outline-success addPic">
                <i class="fa-solid fa-plus"></i> Add more pictures
              </button>
              <input
                accept="image/jpeg, image/png, image/jpg, image/webp, image/heif, image/svg"
                style="display: none;"
                type="file"
                class="fileListForManage input-${index + 1}"
                multiple
              />
            </td>
            <td class="files">
              ${item.content_file.length ? `<button type="button" class="btn btn-sm btn-info toggle-files-btn mb-2">Show File</button>` : `<button type="button" class="btn btn-sm btn-secondary toggle-files-btn mb-2" disabled>No File</button>`}
               <div class="file-gallery" style="display: none;">
                ${checkFileExt(item.content_file , item.newContentFile)}
               </div>
            </td>
            <td class="date_time">${formatDate(item.date_time) || 'N/A'}
              <div style="display:none">
                ${item.id_content || ''}
              </div>
              <span style="display:none">${item.date_time}</span>
            </td>
            <td class="content_stage fs-6">${!item.deleted ? '<span class="badge rounded-pill  text-bg-primary">Active</span>' : '<span class="badge rounded-pill text-bg-danger">Deactivate</span>'}</td>
            <td class="btn_container_table">
              <button type="button" class="btn btn-primary btn-sm editBtn d-flex">Edit</button> 
              <button type="button" class="btn btn-danger deactivateBtn btn-sm" style="display: none">Deactivate</button>
              <button type="button" class="btn btn-success activateBtn btn-sm" style="display: none">Activate</button>
            </td>
          </tr>`;

    tableBody.prepend(row);
});
}

function formatDate (date) {
  const dateObj = new Date(date);

 return new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
}).format(dateObj);
};

$('.manage-posts .search_btn').on('click', function() {
  $('.manage-posts .search_input').val('');
  $('.manage-posts .start_date').val('');
  renderData();
}
);
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


function getRowElements(obj) {
  const row = $(obj).closest("tr");
  return {
    id: row.find("td.newId"),
    content: row.find("td.content"),
    title: row.find("td.title"),
    imageContainer: row.find("td.image_container"),
    dateTime: row.find("td.date_time"),
    contentStage: row.find("td.content_stage"),
    status: row.find("td.content_stage span"),
  };
}

$("button.backButton").on("click", function () {
  window.history.back();
});

$(".manage-posts").on(
  "click",
  ".table-group-divider .editBtn",
  async function () {
    const button = $(this);
    // const {id} = getRowElements($(this));
    const isEditing = button.html() === "Edit";
    const isSaving = button.html() === "Save";
    if (isEditVariable && !isEditVariable.is(button)) {
      showNotification(
        "Warning! ",
        "You are editing on another row. Please save it before continuing!",
        "alert-success",
        "alert-warning"
      );
      return;
    }
    if (isEditing) {
      isEditVariable = button;
      changeEditBtn(button, "btn-primary", "btn-success", "Save", 1);
      editContentTitle(button);
    } else if (isSaving) {
      changeEditBtn(button, "btn-success", "btn-primary", "Edit", 0);
      saveContentTitle(button);
      await pushNewPicToServer(button);
      pushOrUpdate(editContentJson, generateJsonForEdit(button));
      check_update();
      isEditVariable = null;
      console.log(editContentJson)
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
  const lengthofImage = addPicBtn.parent().children(".image-gallery").children('.img-box').length;
  if (lengthofImage >= 10) {
    $(".alert-intranet").css("display", "block");
    $(".alert-intranet strong").html("Warning! ");
    $(".alert-intranet span").html("Maximum number of pictures are 10.");
    $(".alert-intranet").removeClass("alert-success");
    $(".alert-intranet").addClass("alert-warning");
    return;
  }
  input.click();
  input.off("change").change((e) => {
    handleChoosePicture(e);
    const limitNum = Imgsarray.length + lengthofImage;
    if (limitNum > 10) {
      Imgsarray = Imgsarray.slice(0, 10 - lengthofImage);
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
    addPicBtn.parent().children(".image-gallery").append(imgElements.join(""));
    // addPicBtn.before(imgElements.join());
    // $('.toggle-images-btn').click();
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

    $(".loader").css({
      display: "block",
    });

    $(".manage-posts").css({
      filter: "blur(5px)",
    });

    $("body").css({
      "user-select": "none",
    });

    const result = await fetch(`${HTTP_Request_address}/manage/update`, {
      // const result = await fetch("https://5843-118-69-122-202.ngrok-free.app/manage/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: dataJson,
    });

    const data = await result.text();
    setTimeout(() => {
      $(".alert-intranet").css("display", "block");
    
      setTimeout(() => {
        location.reload();
      }, 2000); // Reload sau 3 giây
    
      $(".loader").css({ display: "none" });
      $(".manage-posts").css({ filter: "" });
    }, 1000); // Thực hiện sau 1 giây
    
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
$(".manage-posts").on("click", ".deactivateBtn", function () {
  // getRowElements(this).contentStage.text("Deactivate");
  getRowElements(this).contentStage.html(
    '<span class="badge rounded-pill text-bg-danger">Deactivate</span>'
  );
});
$(".manage-posts").on("click", ".activateBtn", function () {
  getRowElements(this).contentStage.html(
    '<span class="badge rounded-pill text-bg-success">Active</span>'
  );
});
function handleChoosePicture(event) {
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
}

async function pushNewPicToServer(obj) {
  const { imageContainer } = getRowElements(obj);
  const afterEditImgArray = [];
  const childOfImageContainer = imageContainer.children("div.image-gallery");
  const numOfBasic = childOfImageContainer.children('div.img-box').children("img.basic_image").length;
  const numOfPic = childOfImageContainer.children('div.img-box').children("img").length;

  if (numOfPic > numOfBasic) {
    obj.html('<i class="fa fa-spinner fa-spin"></i>Saving');
    childOfImageContainer.children('div.img-box').children('img[src^="blob:"]').each(function () {
      afterEditImgArray.push($(this).attr("src"));
    });
    const basic_image = childOfImageContainer
      .children('div.img-box')
      .children("img.basic_image")
      .attr("src")
      .split("\\");
    const formData = new FormData();
    formData.append("imgFolderName", basic_image[1]);
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
        `${HTTP_Request_address}/manage/add_news_pics`,
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
    .children("div.image-gallery")
    .children('div.img-box')
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

  imageContainer.children("div.image-gallery").append(imageElements.join(""));
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
  const { imageContainer, status } = getRowElements(button);
  const toggleBtn = imageContainer.find('.toggle-images-btn');
  $(button)
    .parents("tr")
    .css({
      "background-color": opacity ? "rgba(0, 0, 0, 0.063)" : "",
    });
  
  imageContainer.find(".closeBtn").css("opacity", opacity);
  imageContainer
    .find(".closeBtn")
    .prop("disabled", !imageContainer.find(".closeBtn").prop("disabled"));
  if(toggleBtn.html() !== 'No Pictures'){
    imageContainer.find(".addPic").css("display", opacity ? "block" : "none");
    if(opacity){
      if(toggleBtn.html() === 'Show Pictures') toggleBtn.click();
    }else{
      if(toggleBtn.html() === 'Hide Pictures') toggleBtn.click();
    }
  }
  if(status.hasClass("text-bg-danger")) {
    button.next().next().css("display" , opacity && "block");
    
  }else {
    button.next().css("display", opacity && "block");
  }
  button.next().css('display' , !opacity && "none");
  button.next().next().css('display' , !opacity && "none");
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
        ></textarea>
      </div>`
  );

  const quill = new Quill("#quill-editor-content", {
    theme: "snow",
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
  const { title, content, dateTime, imageContainer , status } = getRowElements(button);
  const contentId = dateTime.find("div").text().trim();
  const contentDate = dateTime.find('span').text().trim();
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
    const content_images = images.map((item) => {
      const parts = item.split("\\");
      return parts[parts.length - 1];
    });
  const timenow = getDate();
  if(images.length){
    const images_link1 = images[0].split("\\")[1];
    // const images_link2 = images[0].split("\\")[2];
    const images_link = images_link1;
    

    return {
      id_content: contentId,
      title: title.text(),
      content: contentNew,
      images_link: images_link,
      content_images: content_images,
      poster: "",
      date_time: contentDate,
      last_updated: timenow,
      deleted: status.hasClass("text-bg-danger") ? 1 : 0,
      poster_site: "string",
    };
  }
  return {
    id_content: contentId,
    title: title.text(),
    content: contentNew,
    images_link: null,
    content_images: content_images,
    poster: "",
    date_time: contentDate,
    last_updated: timenow,
    deleted: status.hasClass("text-bg-danger") ? 1 : 0,
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
