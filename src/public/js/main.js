// $(document).on('click', '.navbar-nav.countries button', function(event) {
//     event.preventDefault(); // Ngăn chặn form gửi đi
//     console.log($(this).text()); 
// });
const htpp_request = "http://localhost:3000";

$(document).on("click", ".navbar-nav.countries button", function (event) {
    event.preventDefault(); // Ngăn chặn form submit mặc định
    const site = $(this).val(); // Lấy giá trị site từ button
    if(site === 'Home'){
      window.location.href = "/homepage";
    }else{
      window.location.href = `/activities?site=${site}`; // Chuyển trang với query string
    }
  });
