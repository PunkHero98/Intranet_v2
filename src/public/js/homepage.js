$(".welcome-homepage .col-12 #TicketSystem").on("click", function () {
  window.open("https://helpdesk.qsl.support", "_blank");
});

$(".welcome-homepage .col-12 #team").on("click", function () {
  window.open("/teams", "_blank");
});

let currentPage = 0;
let totalPages = 0;
let newsData = [];
let filterData= [];
let currentSortOrder = "desc";
let userRole = "";

$(document).ready(async function () {
  await fetchAndStoreNews();
  renderHRList();
});

function renderHRList() {
  userRole.forEach((poster) => {
    $("#posterList").append(`<li class="list-group-item" data-value="${poster.username}">${poster.username}</li>`);
  });
  $('#posterInput').val('All');
}


async function fetchAndStoreNews() {
  try {
    const response = await fetch(`http://localhost:3000/homepage/getall`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    unFilteredData = data.result;
    newsData = unFilteredData.filter((item) =>  !item.deleted);
    userRole = data.userRole;
    totalPages = Math.ceil(newsData.length / 8);
    sortAndRenderNews();
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

function sortAndRenderNews(data = newsData) {
  if (currentSortOrder === "desc") {
    data.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
    $('#btnTimeDesc').addClass('btn-primary').removeClass('btn-secondary');
    $('#btnTimeAsc').addClass('btn-secondary').removeClass('btn-primary');
  } else {
    data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
    $('#btnTimeAsc').addClass('btn-primary').removeClass('btn-secondary');
    $('#btnTimeDesc').addClass('btn-secondary').removeClass('btn-primary');
  }

  renderPage(data.slice(0, 8));
  currentPage = 0;
  totalPages = Math.ceil(data.length / 8);
  renderPagination(1, totalPages);
}

function renderPage(array) {
  $(".whats-new-intranet .mainArea").empty();
  array.forEach((f) => {
    let contentFileLength = 0;
    if(JSON.parse(f.content_file)) {
      contentFileLength = JSON.parse(f.content_file).length;
    } else {
      contentFileLength = 0;
    }  
    $(".whats-new-intranet .mainArea").append(`
      <div class="col-xl-6 col-md-6 col-sm-12">
        <div class="row content-news ${isNew(f.date_time) && 'content-news-extreme'}" style="cursor: pointer;" onClick="window.location.href='content/${f.id_content}'">
          <div class="col-3 news-img p-0">
            <a href="content/${f.id_content}">
              <img class="object-fit-cover" src="${f.content_images.length ? f.content_images : '/imgs/qsl-sample-pic.png'}" loading='lazy' 
              onerror="this.onerror=null; this.src='/imgs/qsl-sample-pic.png';" />
            </a>
          </div>
          <div class="col-9 news-content position-relative text-justify">
            <a href="content/${f.id_content}" class="text-black text-decoration-none">
              <h5 class="m-0">${f.title}</h5>
            </a>
            <div class="m-0 text-reset content_area">
              ${f.content}
            </div>
    
            <i class="position-absolute text-light-emphasis">
              ${f.poster} |
              ${formatDate(f.date_time)} |
              ${f.poster_site} 
              <!-- ${contentFileLength ? `| ${contentFileLength} ${contentFileLength > 1 ? 'files' : 'file'} attached` : ''} -->
              ${f.contentStat.total_views ? `| ${f.contentStat.total_views} ${f.contentStat.total_views > 1 ? 'views' : 'view'}` : ''} 
              ${f.contentStat.total_likes ? `| ${f.contentStat.total_likes} ${f.contentStat.total_likes > 1 ? 'likes' : 'like'}` : ''} 
              ${f.contentStat.total_comments ? `| ${f.contentStat.total_comments} ${f.contentStat.total_comments > 1 ? 'comments' : 'comment'}` : ''}
            </i>  
          </div>
        </div>
      </div>
    `);
    
  });
}
function formatDate(date) {
  const dateObj = new Date(date);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const year = dateObj.getFullYear();
  const month = months[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');

  return `${month}, ${day}, ${year} - ${hour}:${minute}`;
}


// Hàm hiển thị phân trang
function renderPagination(currentPage, totalPages) {
  const pagination = $(".pagination");
  pagination.empty();

  const disabled = (condition) => condition ? "disabled" : "";
  const active = (condition) => condition ? "active" : "";

  // Nút về trang đầu
  pagination.append(`
    <li class="navigation-first ${disabled(currentPage === 1)}">
      <a class="page-link" data-page="1" href="#" ${disabled(currentPage === 1) ? "tabindex='-1' aria-disabled='true'" : ""}>
        <i class="fa-solid fa-angles-left"></i>
      </a>
    </li>
  `);

  // Nút Previous
  pagination.append(`
    <li class="navigation-left ${disabled(currentPage === 1)}">
      <a class="page-link" data-page="${currentPage - 1}" href="#" ${disabled(currentPage === 1) ? "tabindex='-1' aria-disabled='true'" : ""}>
        <i class="fa-solid fa-angle-left"></i>
      </a>
    </li>
  `);

  // Tạo danh sách các nút số trang
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.append(`
        <li class="page-item ${active(currentPage === i)}">
          <a class="page-link" data-page="${i}" href="#">${i}</a>
        </li>
      `);
    }
  } else {
    // Trang đầu
    pagination.append(`
      <li class="page-item ${active(currentPage === 1)}">
        <a class="page-link" data-page="1" href="#">1</a>
      </li>
    `);

    if (currentPage > 3) {
      pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
    }

    // Các trang ở giữa
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pagination.append(`
        <li class="page-item ${active(currentPage === i)}">
          <a class="page-link" data-page="${i}" href="#">${i}</a>
        </li>
      `);
    }

    if (currentPage < totalPages - 2) {
      pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
    }

    // Trang cuối
    pagination.append(`
      <li class="page-item ${active(currentPage === totalPages)}">
        <a class="page-link" data-page="${totalPages}" href="#">${totalPages}</a>
      </li>
    `);
  }

  // Nút Next
  pagination.append(`
    <li class="navigation-right ${disabled(currentPage === totalPages)}">
      <a class="page-link" data-page="${currentPage + 1}" href="#" ${disabled(currentPage === totalPages) ? "tabindex='-1' aria-disabled='true'" : ""}>
        <i class="fa-solid fa-angle-right"></i>
      </a>
    </li>
  `);

  // Nút đến trang cuối
  pagination.append(`
    <li class="navigation-last ${disabled(currentPage === totalPages)}">
      <a class="page-link" data-page="${totalPages}" href="#" ${disabled(currentPage === totalPages) ? "tabindex='-1' aria-disabled='true'" : ""}>
        <i class="fa-solid fa-angles-right"></i>
      </a>
    </li>
  `);
}

const isNew = (createdDate) => {
  const now = new Date();
  const created = new Date(createdDate);
  const diff = (now - created) / (1000 * 60 * 60); // giờ
  return diff < 24;
}

$('.homepage-intranet .filterBtn').on('click', function () { 
  $(".filter_container").toggleClass("show");
  const filterBtn = $(this).children().attr('class');
  if(filterBtn === 'fa-solid fa-filter-circle-xmark') {
    $(this).children().attr('class', 'fa-solid fa-filter');
  } else {
    $(this).children().attr('class', 'fa-solid fa-filter-circle-xmark');
  };

  if(!$(".advancedFilter_container").hasClass("d-none")) {
    $(".advancedFilter_container").addClass("d-none");
  }
});

$('#btnAdvanced').on('click', function () {

  $('.advancedFilter_container').toggleClass('d-none');
});
// Hàm xử lý khi nhấn nút phân trang
$(".pagination").on("click", ".page-item a", function (e) {
  e.preventDefault();
  const page = $(this).data("page") - 1;
  if (currentPage === page) return;

  const start = page * 8;
  const end = start + 8;
  renderPage(newsData.slice(start, end));
  currentPage = page;
  renderPagination(currentPage + 1, totalPages);
});

// Xử lý nút Previous
$(".pagination").on("click", ".navigation-left a", function (e) {
  e.preventDefault();
  if (currentPage === 0) return;
  currentPage--;
  renderPage(newsData.slice(currentPage * 8, (currentPage + 1) * 8));
  renderPagination(currentPage + 1, totalPages);
});

// Xử lý nút Next
$(".pagination").on("click", ".navigation-right a", function (e) {
  e.preventDefault();
  if (currentPage + 1 >= totalPages) return;
  currentPage++;
  renderPage(newsData.slice(currentPage * 8, (currentPage + 1) * 8));
  renderPagination(currentPage + 1, totalPages);
});

$('.pagination').on('click', '.navigation-first a', function (e) {
  e.preventDefault();
  if(currentPage === 0) return;
  currentPage = 0;
  renderPage(newsData.slice(currentPage * 8, (currentPage + 1) * 8));
  renderPagination(currentPage + 1, totalPages);
});

$('.pagination').on('click', '.navigation-last a', function (e) {
  e.preventDefault();
  if(currentPage + 1 >= totalPages) return;
  currentPage = totalPages - 1;
  renderPage(newsData.slice(currentPage * 8, (currentPage + 1) * 8));
  renderPagination(currentPage + 1, totalPages);
});
// Xử lý filter thay đổi

$('#btnTimeDesc').on('click', function () {
  if(currentSortOrder
    === 'desc') return;
  currentSortOrder = 'desc';

  if(filterData.length) {
    sortAndRenderNews(filterData);
  }else{
    sortAndRenderNews();
  }
});


$('#btnTimeAsc').on('click', function () {
  if(currentSortOrder
    === 'asc') return;
  currentSortOrder = 'asc';
  if(filterData.length) {
    sortAndRenderNews(filterData);
  }else{
    sortAndRenderNews();
  }
});

// document.getElementById("posterInput").addEventListener("input", function() {
//   let input = this.value.toLowerCase();
//   let options = document.querySelectorAll("#filterPoster option");

//   options.forEach(option => {
//       let text = option.textContent.toLowerCase();
//       option.style.display = text.includes(input) ? "block" : "none";
//   });
// });

$('#posterInput').on('focus', function() {
  $('#posterList').show(); // Hiển thị danh sách
});

$('#posterList').on('click','li' ,  function() {
  $('#posterList li').removeClass('active');     
  $(this).addClass('active');
  $('#posterInput').val($(this).text()); // Gán giá trị vào input
  $('#posterList').hide(); // Ẩn danh sách sau khi chọn
});

// Ẩn danh sách khi click ra ngoài
$(document).on('click', function(e) {
  if (!$(e.target).closest('#posterInput, #posterList').length) {
      $('#posterList').hide();
  }
});
$('#posterInput').on('input', function() {
  let input = this.value.toLowerCase();
  let options = $("#posterList li");

  options.each(function() {
      let text = $(this).text().toLowerCase();
      $(this).css('display', text.includes(input) ? "block" : "none");
  });
});

$('.homepage-intranet #advancedFilter').on('submit', function (e) {
  e.preventDefault();
  filterNews();
});

$('.homepage-intranet #clearFilter').on('click', function () {
  $('#posterInput').val('all');
  $('#filterTime').val('');
  $('#filterSite').val('all');
  filterData = [];
  sortAndRenderNews();
});

function filterNews() {
  let poster = $('#posterInput').val().toLowerCase();
  let time = $('#filterTime').val();
  let site = $('#filterSite').val().toLowerCase();
  filterData = [];

  filterData = newsData.filter((item) => {
    let matchPoster = poster === "all" || item.poster.toLowerCase().includes(poster);
    let matchTime = !time || item.date_time.startsWith(time);
    let matchSite = site === "all" || item.poster_site.toLowerCase() === site;

    return matchPoster && matchTime && matchSite;
  });
  sortAndRenderNews(filterData);
}

