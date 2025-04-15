// $(document).on('click', '.navbar-nav.countries button', function(event) {
//     event.preventDefault(); // Ngăn chặn form gửi đi
//     console.log($(this).text()); 


// });
const htpp_request = "http://localhost:3000";
let feedbackImage = [];

$(document).on("click", ".navbar-nav.countries button", function (event) {
    event.preventDefault(); // Ngăn chặn form submit mặc định
    const site = $(this).val(); // Lấy giá trị site từ button
    if(site === 'Home'){
      window.location.href = "/homepage";
    }else{
      window.location.href = `/activities?site=${site}`; // Chuyển trang với query string
    }
  });

  $('#fbAddPic').on('click', function () {
    const input = $('#fbAddPicInput');
  
    input.off('change').on('change', function () {
      const files = Array.from(this.files);
      if (!files.length) return;
  
      for (const file of files) {
        if (feedbackImage.length >= 3) {
          alert('You can only upload a maximum of 3 pictures.');
          break;
        }
  
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          alert(`"${file.name}" > 2MB. Skipped.`);
          continue;
        }
  
        // Check file name trùng (đơn giản) – bạn có thể dùng hash để chắc chắn
        if (feedbackImage.find(f => f.name === file.name && f.size === file.size)) {
          alert(`Duplicate image "${file.name}" skipped.`);
          continue;
        }
  
        const imgId = Date.now() + Math.random().toString(36).substring(2, 6);
        const blobUrl = URL.createObjectURL(file);
  
        feedbackImage.push(file);
  
        $('.image_container').append(`
          <div class="position-relative p-1" style="width: calc(33.333% - 10px);" id="img-${imgId}">
            <button type="button" class="btn-close position-absolute top-0 end-0 m-1 btn-sm btn-remove-img"
              aria-label="Close" data-name="${file.name}" data-target="#img-${imgId}">
            </button>
            <img src="${blobUrl}" class="img-thumbnail w-100" alt="Feedback Image">
          </div>
        `);
      }
  
      this.value = '';
    });
  
    input.click();
  });
 
  $(document).on('click', '.btn-remove-img', function () {
    const fileName = $(this).data('name');
    const targetId = $(this).data('target');
  
    const index = feedbackImage.findIndex(file => file.name === fileName);
    if (index !== -1) {
      feedbackImage.splice(index, 1);
    }
  
    $(targetId).remove();
  });

$('#feedBackModal .modal-footer .btn-primary').on('click',async function() {
  const fb_category = $('#feedback-category').val();
  const fb_message = $('#message-text').val();

  if(!fb_category || !fb_message) {
    alert('Please fill in all fields.');
    return;
  }
  const formData = new FormData();
  formData.append('fb_category', fb_category);
  formData.append('fb_message', fb_message);
  if(feedbackImage.length > 0) {
    feedbackImage.forEach((img, index) => {
      formData.append(`feedback_images`, img);
    });
  }

  try{
    const result = await fetch(`${htpp_request}/feedback`, {
      method: 'POST',
      body: formData,
    });
    if (!result.ok) {
      throw new Error('Error submitting form');
    }
    const data = await result.json();
    console.log(data);
    showNotification('Success', 'Thank you for your feedback!', 'alert-danger', 'alert-success');
    $('#feedback-category').val('');
    $('#message-text').val('');
    feedbackImage = [];
    $('.image_container').empty();
    $('#feedBackModal').modal('hide');
  }catch(err){
    showNotification('Error', err.message, 'alert-success', 'alert-danger');
  }
});

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
