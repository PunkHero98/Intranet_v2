$(".welcome-homepage .col-4 #TicketSystem").on("click", function () {
  window.open("https://helpdesk.qsl.support", "_blank");
});

$(".welcome-homepage .col-4 #team").on("click", function () {
  window.open("/teams", "_blank");
});

$('.welcome-homepage .col-4 #CapexRequest').on('click', function () {
  window.open("http://capexform.qsl.local:191", "_blank");
});

let currentPage = 1;
let totalPages = 0;
let filterData= [];
let currentFilter = {
  poster: "All",
  time: null,
  site: "All",
  order: "desc",
}
let userRole = "";
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let holidays = [];
const serverUrl = window.location.origin;

$(document).ready(async function () {
  await getTotalPages();
  renderPagination(currentPage, totalPages);
  await fetchAndStoreNews();
  renderHRList();

  
  // Khởi tạo lần đầu
  // fetchHolidayData(currentYear, currentMonth);
});

async function getTotalPages() {
  try {
    const response = await fetch(`${serverUrl}/homepage/total`);
    const data = await response.json();
    totalPages = data.total;
    userRole = data.userRole;
  } catch (err) {
    console.error("Error fetching total pages:", err);
  }
}

async function fetchHolidayData(year = 2025, month = 1) {
    try {
      const response = await fetch(`${serverUrl}/holiday/vn?year=${year}&month=${month}`);
      const data = await response.json();
      holidays = data;
      renderCalendarFromData(holidays);
    } catch (err) {
      console.error("Lỗi khi lấy ngày lễ:", err);
    }
  }

 function renderCalendarFromData(data) {
  const grid = document.getElementById('calendarGrid');
  $('#currentMonth').text('Tháng ' + currentMonth + ' Năm ' + currentYear);
  grid.innerHTML = '';

  if (!data || data.length === 0) return;

  const firstDate = new Date(data[0].date);
  const firstDay = firstDate.getDay(); // 0 = Sun

  // Add các ô trống đầu tháng nếu ngày 1 không phải Chủ nhật
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('border', 'p-1', 'bg-light');
    grid.appendChild(emptyDiv);
  }

  // Add các ngày trong tháng
  data.forEach(item => {
    const date = new Date(item.date);
    const day = date.getDate();
    const isSunday = date.getDay() === 0;

    const dayDiv = document.createElement('div');
    dayDiv.className = `border p-1 text-center ${item.isHoliday ? 'bg-danger text-white' : 'bg-white'} ${isSunday ? 'text-danger fw-bold' : ''}`;
    dayDiv.innerHTML = `
      <strong>${day}</strong>
    `;
    dayDiv.title = item.holidayName || '';
    grid.appendChild(dayDiv);
  });
}



  // Form trigger
  $('#triggerHolidayData').on('click', function () {
    const year = parseInt($('#holidayYear').val(), 10);
    const month = parseInt($('#holidayMonth').val(), 10);

    if (!year || !month || month < 1 || month > 12) {
      alert("Vui lòng nhập đúng năm và tháng (1-12)");
      return;
    }

    currentYear = year;
    currentMonth = month;
    fetchHolidayData(year, month);
  });


function renderHRList() {
  userRole.forEach((poster) => {
    $("#posterSelect").append(`<option value="${poster.username}">${poster.username}</option>`);
  });
}

function generateQueryParams(object){
  return new URLSearchParams({
    poster: object.poster,
    time: object.time,
    site: object.site,
    order: object.order,
  });
}

async function fetchAndStoreNews(page = 1 , object = currentFilter) {
  try {
    $(".whats-new-intranet .mainArea").html("<h3 class='text-center'>Loading...</h3>");
    const response = await fetch(`${serverUrl}/homepage/${page}?${generateQueryParams(object)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const newsArray = data.contents;
    if (newsArray.length === 0) {
      $(".whats-new-intranet .mainArea").html("<h3 class='text-center'>No news available</h3>");
      return;
    }
    renderPage(newsArray);
  } catch (err) {
    console.error("Error fetching news:", err);
  }
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
              <img class="" src="${f.content_images.length ? f.content_images : '/imgs/qsl-sample-pic.png'}" loading='lazy' 
              onerror="this.onerror=null; this.src='/imgs/qsl-sample-pic.png';" />
            </a>
          </div>
          <div class="col-9 news-content position-relative text-justify">
            <a href="content/${f.id_content}" class="text-black text-decoration-none">
              <h5 class="m-0">${f.title}</h5>
            </a>
            <div class="text-reset content_area">
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

  return `${month} ${day}, ${year} - ${hour}:${minute}`;
}


// Hàm hiển thị phân trang
function renderPagination(currentPage, totalPages) {
  const pagination = $(".pagination");
  pagination.empty();

  // Render previous button
  pagination.append(`
    <li class="navigation-first"><a class="page-link" href="#"><i class="fa-solid fa-angle-double-left"></i></a></li>
    <li class="navigation-left"><a class="page-link" href="#"><i class="fa-solid fa-angle-left"></i></a></li>
  `);

  // Render page numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.append(`
      <li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>
    `);
  }

  // Render next button
  pagination.append(`
    <li class="navigation-right"><a class="page-link" href="#"><i class="fa-solid fa-angle-right"></i></a></li>
    <li class="navigation-last"><a class="page-link" href="#"><i class="fa-solid fa-angle-double-right"></i></a></li>
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
$(".pagination").on("click", ".page-item a", async function (e) {
  e.preventDefault();
  const page = parseInt($(this).data("page"));
  if(page === currentPage) return;
  await fetchAndStoreNews(page , currentFilter);
  $(".pagination .page-item").removeClass("active");
  $(this).parent().addClass("active");
  currentPage = page;
});

// Xử lý nút Previous
$(".pagination").on("click", ".navigation-left a", async function (e) {
  e.preventDefault();
  if (currentPage === 1) return;
  currentPage--;
  await fetchAndStoreNews(currentPage, currentFilter);
  $(".pagination .page-item").removeClass("active");
  $(`.pagination .page-item a[data-page="${currentPage}"]`).parent().addClass("active");
});

// Xử lý nút Next
$(".pagination").on("click", ".navigation-right a", async function (e) {
  e.preventDefault();
  if (currentPage >= totalPages) return;
  
  currentPage++;
  await fetchAndStoreNews(currentPage, currentFilter);
  $(".pagination .page-item").removeClass("active");
  $(`.pagination .page-item a[data-page="${currentPage}"]`).parent().addClass("active");
});

$('.pagination').on('click', '.navigation-first a', async function (e) {
  e.preventDefault();
  if(currentPage === 1) return;

  currentPage = 1;
  await fetchAndStoreNews(currentPage, currentFilter);
  $(".pagination .page-item").removeClass("active");
  $(`.pagination .page-item a[data-page="${currentPage}"]`).parent().addClass("active");
});

$('.pagination').on('click', '.navigation-last a', async function (e) {
  e.preventDefault();
  if(currentPage >= totalPages) return;

  currentPage = totalPages;
  await fetchAndStoreNews(currentPage, currentFilter);
  $(".pagination .page-item").removeClass("active");
  $(`.pagination .page-item a[data-page="${currentPage}"]`).parent().addClass("active");
});

$('#btnTimeDesc').on('click', async function () {
  if(currentFilter.order === 'desc') return;
  currentFilter.order = 'desc';
  $(this).addClass('btn-primary').removeClass('btn-secondary');
  $(this).siblings().removeClass('btn-primary').addClass('btn-secondary');
  await fetchAndStoreNews(currentPage, currentFilter);
});


$('#btnTimeAsc').on('click', async function () {
  if(currentFilter.order === 'asc') return;
  currentFilter.order = 'asc';
  $(this).addClass('btn-primary').removeClass('btn-secondary');
  $(this).siblings().removeClass('btn-primary').addClass('btn-secondary');
  await fetchAndStoreNews(currentPage, currentFilter);
});

// document.getElementById("posterInput").addEventListener("input", function() {
//   let input = this.value.toLowerCase();
//   let options = document.querySelectorAll("#filterPoster option");

//   options.forEach(option => {
//       let text = option.textContent.toLowerCase();
//       option.style.display = text.includes(input) ? "block" : "none";
//   });
// });


$('.homepage-intranet #advancedFilter').on('submit', function (e) {
  e.preventDefault();
  filterNews();
  $('#advancedFilter').toggleClass('d-none');
});

$('.homepage-intranet #clearFilter').on('click', async function () {
  $('#posterSelect').val('All');
  $('#filterTime').val('');
  $('#filterSite').val('All');
  currentFilter = {...currentFilter,
    poster: 'All',
    time: null,
    site: 'All'
  }
  await fetchAndStoreNews(currentPage, currentFilter);
});

async function filterNews() {
  currentFilter.poster = $('#posterSelect').val();
  currentFilter.time = $('#filterTime').val() || null;
  currentFilter.site = $('#filterSite').val();

  await fetchAndStoreNews(currentPage, currentFilter);
}

