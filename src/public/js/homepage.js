let currentPage = 0;
$(".welcome-homepage .col-12 #TicketSystem").on("click", function () {
  window.open("https://helpdesk.qsl.support", "_blank");
});
$(".welcome-homepage .col-12 #team").on("click", function () {
  window.open("/teams", "_blank");
});
$(".Page.navigation").ready(async function () {
  try {
    const respone = await fetch("http://localhost:3000/homepage/0", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ someData: "" }),
    });
    const data = await respone.json();
    renderPage(data.result);
  } catch (err) {
    console.log(err);
  }
});

$(".pagination").on("click", ".page-item a", async function (e) {
  e.preventDefault();
  const page = $(this).data("page");
  const newPage = page - 1;
  if (currentPage === newPage) return;
  try {
    const respone = await fetch("http://localhost:3000/homepage/" + newPage, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ someData: "" }),
    });
    const data = await respone.json();
    renderPage(data.result);
    currentPage = page;
  } catch (err) {
    console.log(err);
  }
});

$(".pagination .navigation-left").on("click", async function (e) {
  e.preventDefault();
  if (currentPage === 0) return;
  const page = currentPage - 1;

  try {
    const respone = await fetch("http://localhost:3000/homepage/" + page, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ someData: "" }),
    });
    const data = await respone.json();
    renderPage(data.result);
    currentPage = page;
  } catch (err) {
    console.log(err);
  }
});
$(".pagination .navigation-right").on("click", async function (e) {
  e.preventDefault();
  const numPage = $(".pagination .page-item").length - 1;

  if (currentPage >= numPage) return;
  const page = currentPage + 1;

  try {
    const respone = await fetch("http://localhost:3000/homepage/" + page, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ someData: "" }),
    });
    const data = await respone.json();
    renderPage(data.result);
    currentPage = page;
  } catch (err) {
    console.log(err);
  }
});
function renderPage(array) {
  $(".whats-new-intranet .d-flex").empty();
  array.forEach((f) => {
    $(".whats-new-intranet .d-flex").append(`
      <div class="col-xl-6 col-md-6 col-sm-12">
          <div class="row content-news">
            <!-- image content -->
            <div class="col-3 news-img p-0">
              <a href="content/${f.id_content}">
                <img class="object-fit-cover" src=${f.content_images} />
              </a>
            </div>
            <!-- body content -->
            <div class="col-9 news-content position-relative text-justify">
              <a
                href="content/${f.id_content}"
                class="text-black text-decoration-none"
              >
                <h5 class="m-0">${f.title}</h5>
              </a>
              <div class="m-0 content_area">${f.content}</div>
              <i class="text-light-emphasis position-absolute">Posted:
                ${f.poster}
                |
                ${f.date_time}
                |
                ${f.poster_site}</i>
            </div>
          </div>
        </div>
      `);
  });
}
