let currentPage = 0; // Trang hiện tại
let totalPages = 0; // Tổng số trang, giá trị sẽ được backend trả về.

$(".welcome-homepage .col-12 #TicketSystem").on("click", function () {
  window.open("https://helpdesk.qsl.support", "_blank");
});

$(".welcome-homepage .col-12 #team").on("click", function () {
  window.open("/teams", "_blank");
});

$(".Page.navigation").ready(async function () {
  await fetchAndRenderPage(0); // Tải dữ liệu và phân trang khi khởi động
});

$(".pagination").on("click", ".page-item a", async function (e) {
  e.preventDefault();
  const page = $(this).data("page");
  const newPage = page - 1;
  if (currentPage === newPage) return;

  await fetchAndRenderPage(newPage);
});

$(".pagination").on("click", ".navigation-left a", async function (e) {
  e.preventDefault();
  if (currentPage === 0) return;

  await fetchAndRenderPage(currentPage - 1);
});

$(".pagination").on("click", ".navigation-right a", async function (e) {
  e.preventDefault();
  if (currentPage + 1 >= totalPages) return;

  await fetchAndRenderPage(currentPage + 1);
});

async function fetchAndRenderPage(page) {
  try {
    const response = await fetch(`http://localhost:3000/homepage/${page}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ someData: "" }),
    });
    const data = await response.json();

    renderPage(data.result); // Hiển thị dữ liệu
    currentPage = page; // Cập nhật trang hiện tại
    totalPages = data.totalPages; // Cập nhật tổng số trang từ backend
    renderPagination(currentPage + 1, totalPages); // Hiển thị pagination
  } catch (err) {
    console.error("Error fetching page data:", err);
  }
}

function renderPagination(currentPage, totalPages) {
  const maxVisiblePages = 3;
  const pagination = $(".pagination");
  pagination.empty();

  // Nút Previous
  pagination.append(`
    <li class="navigation-left ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#">
        <i class="fa-solid fa-chevron-left"></i>
      </a>
    </li>
  `);

  // Trang đầu tiên
  pagination.append(`
    <li class="page-item ${currentPage === 1 ? "active" : ""}">
      <a class="page-link" data-page="1" href="#">1</a>
    </li>
  `);

  if (currentPage > maxVisiblePages + 1) {
    pagination.append(`
      <li class="page-item disabled">
        <span class="page-link">...</span>
      </li>
    `);
  }

  const start = Math.max(2, currentPage - maxVisiblePages);
  const end = Math.min(totalPages - 1, currentPage + maxVisiblePages);

  for (let i = start; i <= end; i++) {
    pagination.append(`
      <li class="page-item ${currentPage === i ? "active" : ""}">
        <a class="page-link" data-page="${i}" href="#">${i}</a>
      </li>
    `);
  }

  if (currentPage + maxVisiblePages < totalPages - 1) {
    pagination.append(`
      <li class="page-item disabled">
        <span class="page-link">...</span>
      </li>
    `);
  }

  if (totalPages > 1) {
    pagination.append(`
      <li class="page-item ${currentPage === totalPages ? "active" : ""}">
        <a class="page-link" data-page="${totalPages}" href="#">${totalPages}</a>
      </li>
    `);
  }

  pagination.append(`
    <li class="navigation-right ${
      currentPage === totalPages ? "disabled" : ""
    }">
      <a class="page-link" href="#">
        <i class="fa-solid fa-chevron-right"></i>
      </a>
    </li>
  `);
}

function renderPage(array) {
  $(".whats-new-intranet .d-flex").empty();
  array.forEach((f) => {
    $(".whats-new-intranet .d-flex").append(`
      <div class="col-xl-6 col-md-6 col-sm-12">
        <div class="row content-news">
          <div class="col-3 news-img p-0">
            <a href="content/${f.id_content}">
              <img class="object-fit-cover" src=${f.content_images} />
            </a>
          </div>
          <div class="col-9 news-content position-relative text-justify">
            <a href="content/${f.id_content}" class="text-black text-decoration-none">
              <h5 class="m-0">${f.title}</h5>
            </a>
            <div class="m-0 content_area">${f.content}</div>
            <i class="text-light-emphasis position-absolute">Posted:
              ${f.poster} |
              ${f.date_time} |
              ${f.poster_site}</i>
          </div>
        </div>
      </div>
    `);
  });
}
