
const HTTP_Request_address = 'http://localhost:3000';
$(document).ready(function () {
  lightGallery(document.getElementById('lightgallery'), {
    selector: 'a',
    plugins: [lgZoom, lgThumbnail],
    speed: 500,
    zoom: true,
    thumbnail: true,
    download: false
  });

  $('.file-item').on('click', async function () {
    const filePath = $(this).find('.file-name').attr('title');
    const fileExt = filePath.split('.').pop().toLowerCase();
    console.log( fileExt);
    $('#previewContent').html('<p>Loading preview...</p>');
    $('#filePreviewModal').fadeIn();

    if (fileExt === 'pdf') {
      $('#previewContent').html('<p>Loading PDF preview...</p>');
      const loadingTask = pdfjsLib.getDocument({ url: filePath });
      loadingTask.promise.then(async pdf => {
        const numPages = pdf.numPages;
        $('#previewContent').html(''); // clear loading text

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          canvas.className = 'pdf-canvas';
          canvas.style.width = '100%';
          const ctx = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };

          await page.render(renderContext).promise;
          $('#previewContent').append(canvas);
        }
      }).catch(err => {
          $('#previewContent').html('<p style="color:red;">Failed to load PDF: ' + err.message + '</p>');
      });
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      const response = await fetch(filePath);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      // Tạo dropdown chọn sheet
      let sheetSelector = `<label for="sheetSelect">Select sheet: </label>
      <select id="sheetSelect" class="form-select form-select-sm d-inline w-auto ms-2 mb-2">`;

      workbook.SheetNames.forEach((name, i) => {
        sheetSelector += `<option value="${name}">${name}</option>`;
      });
      sheetSelector += `</select>`;

      // Khởi tạo content ban đầu là sheet đầu tiên
      const firstSheetHtml = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
      $('#previewContent').html(sheetSelector + firstSheetHtml);

      // Bắt sự kiện đổi sheet
      $('#sheetSelect').on('change', function () {
        const selectedSheet = $(this).val();
        const html = XLSX.utils.sheet_to_html(workbook.Sheets[selectedSheet]);
        $('#previewContent').html(sheetSelector + html);
      });
    }  else {
      $('#previewContent').html('<p>Unsupported file type for preview.</p>');
    }

  });

  $('#closePreview').on('click', function () {
    $('#filePreviewModal').fadeOut();
  });

  getComment();

});

$("button.backButton").on("click", function () {
  window.history.back();
});

$(".like-btn").click(async function (e) {
  e.preventDefault();
  const $this = $(this);
  const contentId = $this.data("id");

  try {
    const response = await fetch(`${HTTP_Request_address}/content/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentId }),
    });

    const res = await response.json();

    if (res.success) {
      // Thêm class đổi màu trái tim
      $this.find("i").addClass("text-danger");

      // Tăng số lượt like hiển thị
      const currentLikes = parseInt($this.text().trim()) || 0;
      $this.html(`<i class="fa-solid fa-heart text-danger"></i> ${currentLikes + 1}`);

      // Ngăn không cho click thêm lần nữa
      $this.addClass("disabled").css("pointer-events", "none");
    } else {
      // alert(res.message);
      showNotification(
        "Warning ! ",
        res.message,
        "alert-success",
        "alert-warning"
      );
    }
  } catch (err) {
    console.error("Error when liking content:", err);
  }
});

$(document).on('click', '#submitComment', async function (e) {
  console.log("submit comment");
  const contentId = $(".like-btn").data("id");
  const commentText = $('#commentText').val().trim();

  if (commentText === "") {
    showNotification(
      "Warning ! ",
      "Comment cannot be empty",
      "alert-success",
      "alert-warning"
    );
    return;
  }

  try {
    const response = await fetch(`${HTTP_Request_address}/comment/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentId,
        commentText,
        parent_comment_id: null,
      }),
    });

    const res = await response.json();

    if (res.success) {
      // Xử lý thêm comment vào giao diện
      $('#commentText').val(''); // Xóa nội dung ô nhập
      showNotification(
        "Success ! ",
        "Comment added successfully",
        "alert-success",
        "alert-success"
      );
      setTimeout(() => {
        window.location.reload();
      }
      , 300);
    } else {
      showNotification(
        "Warning ! ",
        res.message,
        "alert-success",
        "alert-warning"
      );
    }
  } catch (err) {
    console.error("Error when adding comment:", err);
  }
}
);

$('.comments-view').on('click' , '.editBtn' , function(e){
  e.preventDefault();
  const $thisParent = $(this).parent();
  const $editSection = $thisParent.next();

  $thisParent.css("display" , "none");
  $editSection.css("display" , "block");
});

$('.comments-view').on('click' , '.cancelEditCommentBtn' , function(e){
  e.preventDefault();
  const $thisParent = $(this).parent();
  const $editSection = $thisParent.prev();

  $thisParent.css("display" , "none");
  $editSection.css("display" , "block");
});

async function getComment() {
  try{
    const contentId = $(".like-btn").data("id");
    const result = await fetch(`${HTTP_Request_address}/comment/${contentId}`);
    if(!result.ok) {
      throw new Error("Failed to fetch comments");
    }
    const data = await result.json();
    if(!data.success) {
      throw new Error("Failed to fetch comments");
    }
    const comments = data.comments;
    console.log(comments);
    renderComments(comments);
  

  }catch(err){
    showNotification(
      "Error ! ",
      err.message,
      "alert-success",
      "alert-danger"
    );
  }
}

function renderComments(comments) {
  const commentsContainer = $(".comments-view");
  commentsContainer.empty(); // Xóa nội dung cũ

  if (comments.length === 0) {
    commentsContainer.append('<p class="text-center">No comments yet.</p>');
  } else {
    comments.forEach((comment , index) => {

      const commentElement = $(
        `<div class="d-flex mb-3">
            <img src="/imgs/user/user.png" class="rounded-circle me-2" width="40" height="40" />
            <div class="flex-grow-1">
                <div class="comment-box">
                    <strong>${comment.user.fullname}</strong>
                    <p class="mb-1">${comment.comment_text}</p>
                </div>
                <div class="comment-actions mt-1">
                    <a href="#" class="likeCommentBtn" data-id="${comment.id}"><i class="fa-solid fa-heart me-1"></i>Like</a>
                    <a href="#" class="editBtn"><i class="fa-solid fa-pen-to-square me-1"></i>Edit</a>
                    <span class="comment-time">${formatDate(comment.createdAt)}</span>
                </div>
                <div class="comment-action mt-1 " style="display: none;">
                    <button class="btn btn-sm bg-primary saveEditCommentBtn" style="color: white;">Save Changes</button>
                    <button class="btn btn-sm bg-secondary cancelEditCommentBtn" style="color: white;">Cancel</button>
                    <button class="btn btn-sm bg-danger deleteCommentBtn" style="color: white;">Delete</button>
                </div>
            </div>
        </div>`
      );
      commentsContainer.append(commentElement);
    });
  }

  // Thêm ô nhập comment mới
  commentsContainer.prepend(`
    <div class="d-flex mt-4 mb-3">
        <div class="flex-grow-1">
            <textarea class="form-control textarea-comment mb-2" id="commentText" rows="2" placeholder="Write a comment..."></textarea>
            <button class="btn btn-sm btn-primary" id="submitComment">Send</button>
        </div>
    </div>`);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  // Lấy các thành phần ngày, giờ
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0');

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0h -> 12 AM
  const formattedHours = String(hours).padStart(2, '0');

  return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
}

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
