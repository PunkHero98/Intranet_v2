
const http_request = 'http://localhost:3000';
let feedbackData = [];

$('document').ready(function () {
    getAllFeedBackData();
    
});

$(".add-Btn").css("display", "none");


$("button.backButton").on("click", function () {
    window.history.back();
  });

async function getAllFeedBackData() {
    try{
        const result = await fetch(`${http_request}/feedback/getall`);
        if (!result.ok) {
            throw new Error("Failed to fetch feedback data");
        }
        const data = await result.json();
        console.log(data);
        if (data.result.length === 0) {
            $("#feedback-table").html("<tr><td colspan='6'>No feedback available</td></tr>");
            return;
        }
        feedbackData = data.result;
        renderFeedBack();
    }catch(err){
        showNotification("Error", err.message, "alert-success", "alert-danger");
    }
};

function renderFeedBack () {
    const feedbackTable = $('.table-group-divider');
    feedbackTable.empty();
    let html = "";

    if (feedbackData.length === 0) {
        html = "<tr><td colspan='6'>No feedback available</td></tr>";
        feedbackTable.html(html);
        return;
    }

    feedbackData.forEach((feedback, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${feedback.category}</td>
                <td style="max-width: 300px;word-wrap: break-word;white-space: normal;">${feedback.message}</td>
                <td>
                    ${feedback.feedback_images.length > 0 
                        ? `<button class="view-images" data-images='${JSON.stringify(feedback.feedback_images)}'>View Images</button>` 
                        : "No images"}
                </td>
                <td>${feedback.username}</td>
                <td>${feedback.user_site}</td>
                <td>${formatDate(feedback.created_at)}</td>
                <td>${feedback.is_clear ? "Yes" : "No"}</td>
                <td><button>Edit</button></td>
            </tr>`;
    });

    feedbackTable.html(html); // ✅ Chỉ append 1 lần duy nhất sau vòng lặp
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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Đúng cách khi phần tử tạo ra sau
$(document).on('click', '.view-images', function (e) {
    e.preventDefault();
    const images = JSON.parse($(this).attr('data-images'));
    const $gallery = $('#lightgallery');
    $gallery.empty();

    images.forEach(url => {
        $gallery.append(`<a href="${url}"><img src="${url}" style="display:none;" /></a>`);
    });

    lightGallery($gallery[0], {
        plugins: [lgZoom, lgThumbnail],
        zoom: true,
        thumbnail: true,
        actualSize: false,
        download: false,
        licenseKey: '0000-0000-000-0000', // Không cần key nếu dùng bản miễn phí
        speed: 400,
    });

    // Auto mở gallery sau khi gắn ảnh
    $gallery.find('a')[0].click();
});

