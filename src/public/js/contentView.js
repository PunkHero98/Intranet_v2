import { EmojiButton } from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.4/dist/index.min.js';
const HTTP_Request_address = 'http://localhost:3000';
let pickerLoaded = false;
let picker;
let slideIndex1 = 1;
 
// ======================================================================
// | I. Initialization & File Preview Events                            |
// ======================================================================
 
// ==== 1. Initialize default slideshow
// This line shows the first image in the slideshow.
showSlides1(slideIndex1);
 
// ==== 2. Setup LightGallery for image preview
// This block sets up the LightGallery plugin and registers events after the DOM is ready.
$(document).ready(function () {
  // Initialize LightGallery for image zoom and thumbnails
  lightGallery(document.getElementById('lightgallery'), {
    selector: 'a',
    plugins: [lgZoom, lgThumbnail],
    speed: 500,
    zoom: true,
    thumbnail: true,
    download: false,
  });
 
  // ==== 3. Handle file item click for preview
  // Handles preview logic based on file type: PDF, Excel, Word, or unsupported
  $('.file-item').on('click', async function () {
    const filePath = $(this).find('.file-name').attr('title');
    const fileExt = filePath.split('.').pop().toLowerCase();
    $('#previewContent').html('<p>Loading preview...</p>');
    $('#filePreviewModal').fadeIn();
 
    // Preview PDF files
    if (fileExt === 'pdf') {
      $('#previewContent').html('<p>Loading PDF preview...</p>');
      const loadingTask = pdfjsLib.getDocument({ url: filePath });
      loadingTask.promise.then(async pdf => {
        const numPages = pdf.numPages;
        $('#previewContent').html('');
 
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
 
    // Preview Excel files
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      const response = await fetch(filePath);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
 
      // Sheet selector dropdown
      let sheetSelector = `<label for="sheetSelect">Select sheet: </label>
      <select id="sheetSelect" class="form-select form-select-sm d-inline w-auto ms-2 mb-2">`;
 
      workbook.SheetNames.forEach((name, i) => {
        sheetSelector += `<option value="${name}">${name}</option>`;
      });
      sheetSelector += `</select>`;
 
      // Render first sheet
      const firstSheetHtml = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
      $('#previewContent').html(sheetSelector + firstSheetHtml);
 
      // Change sheet handler
      $('#sheetSelect').on('change', function () {
        const selectedSheet = $(this).val();
        const html = XLSX.utils.sheet_to_html(workbook.Sheets[selectedSheet]);
        $('#previewContent').html(sheetSelector + html);
      });
 
    // Preview Word files
    } else if(['doc', 'docx'].includes(fileExt)){
      try {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
   
        $('#previewContent').html('<p>Loading Word preview...</p>');
   
        mammoth.convertToHtml({ arrayBuffer })
        .then(function(result) {
          $('#previewContent').html(result.value);
        })
 
        .catch(function(err) {
          console.error("Error parsing .docx:", err);
          $('#previewContent').html('<p style="color:red;">Failed to load Word document.</p>');
        });
      } catch (err) {
        console.error("Fetch failed:", err);
        $('#previewContent').html('<p style="color:red;">Cannot fetch the document file.</p>');
      }
 
    // Unsupported file types
    } else {
      $('#previewContent').html('<p>Unsupported file type for preview.</p>');
    }
  });
 
  // ==== 4. Close preview modal
  $('#closePreview').on('click', function () {
    $('#filePreviewModal').fadeOut();
  });
 
  // ==== 5. Load extra tools & comments
  addRotateFlipButton();    // Adds rotate/flip buttons to toolbar
  getComment();             // Load comments section
});
 
// ==== 6. Emoji Picker Toggle
// Loads emoji picker and inserts emoji into the comment box
$(document).on('click','#emojiToggleBtn', async function () {
  if (!pickerLoaded) {
    try {
      console.log('EmojiButton loaded:', typeof EmojiButton);
      picker = new EmojiButton({ position: 'top-start' });
      picker.on('emoji', emoji => {
        console.log(emoji);
        const $textarea = $('#commentText');
        $textarea.val($textarea.val() + emoji.emoji);
      });
      picker.togglePicker(this);
      pickerLoaded = true;
    } catch (error) {
      console.error('Error loading EmojiButton:', error);
    }
  } else {
    picker.togglePicker(this);
  }
});
 
// ==== 7. Image Flip & Rotate Handlers
// Handles flipping and rotating image in LightGallery preview
$(document).on('click', '#lg-flip-ver', function () {
  const img = $('.lg-img-wrap img');
  const flipped = img.data('flip-ver') || false;
 
  img.css({
    transitionDuration: '400ms',
    transform: flipped ? 'rotate(0deg) scale3d(1, 1, 1)' : 'rotate(0deg) scale3d(1, -1, 1)'
  });
 
  img.data('flip-ver', !flipped);
});
 
$(document).on('click', '#lg-flip-hor', function () {
  const img = $('.lg-img-wrap img');
  const flipped = img.data('flip-hor') || false;
 
  img.css({
    transitionDuration: '400ms',
    transform: flipped ? 'rotate(0deg) scale3d(1, 1, 1)' : 'rotate(0deg) scale3d(-1, 1, 1)'
  });
 
  img.data('flip-hor', !flipped);
});
 
$(document).on('click', '#lg-rotate-left', function () {
  const img = $('.lg-img-wrap img');
  let angle = img.data('rotate') || 0;
 
  angle -= 90;
  img.css({
    transitionDuration: '400ms',
    transform: `rotate(${angle}deg)`
  });
 
  img.data('rotate', angle);
});
 
$(document).on('click', '#lg-rotate-right', function () {
  const img = $('.lg-img-wrap img');
  let angle = img.data('rotate') || 0;
 
  angle += 90;
  img.css({
    transitionDuration: '400ms',
    transform: `rotate(${angle}deg)`
  });
 
  img.data('rotate', angle);
});
 
// ======================================================================
// | II. File Interaction & Commenting                                  |
// ======================================================================
 
// ==== 1. Fetch comment list from server
async function getComment() {
  try {
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
    renderComments(comments);
  } catch(err) {
    showNotification(
      "Error! ",
      err.message,
      "alert-success",
      "alert-danger"
    );
  }
}
 
// ==== 2. Render comments on screen
function renderComments(comments) {
  const commentsContainer = $(".comments-view");
  commentsContainer.empty();    // Clear previous comments
 
  if (comments.length === 0) {
    commentsContainer.append('<p class="text-center">No comments yet.</p>');
  } else {
    comments.forEach((comment , index) => {
      const commentElement = $(
        `<div class="d-flex mb-3">
            <img src="/imgs/user/user.png" class="rounded-circle me-2" width="40" height="40" />
            <div class="flex-grow-1">
                <div class="comment-box ">
                    <strong>${comment.user.fullname}</strong>
                    <p class="mb-1 fs-5">${comment.comment_text}</p>
                </div>
                <div class="comment-actions mt-1 ms-3">
                    <!--<a href="#" class="likeCommentBtn" data-id="${comment.id}"><i class="fa-solid fa-heart me-1"></i>Like</a>
                    <a href="#" class="editBtn"><i class="fa-solid fa-pen-to-square me-1"></i>Edit</a>-->
                    <span class="comment-time">${formatDate(comment.createdAt)} | ${comment.user.user_working_site}</span>
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
 
  // Add input area for new comment
  commentsContainer.prepend(`
    <div class="d-flex mb-3">
    <div class="flex-grow-1 mb-3 position-relative">
        <textarea class="form-control textarea-comment mb-2 fs-5" id="commentText" rows="2" placeholder="Write a comment..."></textarea>
        <button class="btn btn-sm btn-primary" id="submitComment">Send</button>
        <button class="btn btn-sm btn-success" id="emojiToggleBtn">
            <i class="fa-regular fa-face-smile"></i>
        </button>
        <div id="emojiPickerContainer" style="position: absolute; bottom: 40px; left: 0; z-index: 10;"></div>
      </div>
    </div>`);
}
 
// ==== 3. Submit comment to server
$(document).on('click', '#submitComment', async function (e) {
  const contentId = $(".like-btn").data("id");
  const commentText = $('#commentText').val().trim();
 
  // Validate input
  if (commentText === "") {
    showNotification(
      "Warning! ",
      "Comment cannot be empty!",
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
      // Clear input & reload
      $('#commentText').val('');
      showNotification(
        "Success! ",
        "Comment added successfully!",
        "alert-success",
        "alert-success"
      );
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      showNotification(
        "Warning! ",
        res.message,
        "alert-success",
        "alert-warning"
      );
    }
  } catch (err) {
    console.error("Error when adding comment:", err);
  }
});
 
// ======================================================================
// | III. Button Actions & Slide Navigation                             |
// ======================================================================
 
// ==== 1. Go back to previous page
$("button.backButton").on("click", function () {
  window.history.back();
});
 
// ==== 2. Handle "Like" button click
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
      // Change icon color
      $this.find("i").addClass("text-danger");
 
      // Increase like count
      const currentLikes = parseInt($this.text().trim()) || 0;
      $this.html(`<i class="fa-solid fa-heart text-danger"></i> ${currentLikes + 1}`);
 
      // Disable further clicks
      $this.addClass("disabled").css("pointer-events", "none");
    } else {
      showNotification(
        "Warning! ",
        res.message,
        "alert-success",
        "alert-warning"
      );
    }
  } catch (err) {
    console.error("Error when liking content:", err);
  }
});
 
// ==== 3. Edit comment toggle
$('.comments-view').on('click', '.editBtn', function(e){
  e.preventDefault();
  const $thisParent = $(this).parent();
  const $editSection = $thisParent.next();
 
  $thisParent.css("display", "none");
  $editSection.css("display", "block");
});
 
// ==== 4. Cancel edit comment
$('.comments-view').on('click', '.cancelEditCommentBtn', function(e){
  e.preventDefault();
  const $thisParent = $(this).parent();
  const $editSection = $thisParent.prev();
 
  $thisParent.css("display", "none");
  $editSection.css("display", "block");
});
 
// ==== 5. Slide navigation buttons
$('#prevBtnForPic').on('click', function(){
  plusSlides1(-1);  // Go to previous slide
});
 
$('#nextBtnForPic').on('click', function(){
  plusSlides1(1);   // Go to next slide
});
 
// ==== 6. Click on dot to jump to specific slide
$('.dot').on('click', function(){
  const index = $(this).data('dot');  // Get index from data attribute
  currentSlide(index)                 // Jump to selected slide
});
 
// ======================================================================
// | IV. Utility & Supporting Functions                                 |
// ======================================================================
 
// ==== 1. Add rotate & flip buttons to image viewer
function addRotateFlipButton() {
  const buttons = [
    { id: 'lg-flip-ver', class: 'lg-flip-ver lg-icon', title: 'Flip Vertically' },
    { id: 'lg-flip-hor', class: 'lg-flip-hor lg-icon', title: 'Flip Horizontally' },
    { id: 'lg-rotate-left', class: 'lg-rotate-left lg-icon', title: 'Rotate Left' },
    { id: 'lg-rotate-right', class: 'lg-rotate-right lg-icon', title: 'Rotate Right' }
  ];
 
  const container = $('#lg-toolbar-1');
 
  // Append buttons into LightGallery toolbar
  buttons.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = item.class;
    btn.id = item.id;
    btn.title = item.title;
    container.append(btn);
  });
}
 
// ==== 2. Format date to string "yyyy-MM-dd HH:mm"
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
 
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
 
// ==== 3. Show custom notification alert
function showNotification(noti, html, removeClass, addClass) {
  $(".alert-intranet").css("display", "block").css("opacity", "1");
  $(".alert-intranet strong").html(noti);
  $(".alert-intranet span").html(html);
  $(".alert-intranet").removeClass(removeClass).addClass(addClass);
 
  // Auto hide notification after 3 seconds
  setTimeout(() => {
    $(".alert-intranet").css("opacity", "0");
    setTimeout(() => {
      $(".alert-intranet").css("display", "none");
    }, 500);      // Wait for transition to finish
  }, 3000);
}
 
// ==== 4. Show next/previous slide
function plusSlides1(n) {
  showSlides1((slideIndex1 += n));
}
 
// ==== 5. Show selected slide by index
function currentSlide(n) {
  showSlides1((slideIndex1 = n));
}
 
// ==== 6. Render slide image & update dot navigation
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