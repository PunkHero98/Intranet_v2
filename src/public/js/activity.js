
const isNew = (createdDate) => {
  const now = new Date();
  const created = new Date(createdDate);
  const diff = (now - created) / (1000 * 60 * 60); // giờ
  return diff < 24;
}

function checkNewActivity() {
  const activityItems = document.querySelectorAll(".content-news");
  activityItems.forEach(item => {
    const createdDate = item.dataset.createdDate;
    if (isNew(createdDate)) {
      item.classList.add("content-news-extreme");
    }
  });
}

$(document).ready(function () {
  checkNewActivity();
  
  // Xử lý sự kiện click vào nút "Back"
  $("button.backButton").on("click", function () {
    window.history.back();
  });
});