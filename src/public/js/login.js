const HTTP_Request_address = window.location.origin; // Use the current origin for requests

const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

$(document).ready(function () {
  $('.feedBackBtn').css("display", "none");
});

$("#inputShowPassword").on("click", function () {
  if ($("#inputPassword").attr("type") === "password") {
    $("#inputPassword").attr("type", "text");
    $("#inputShowPassword").html('<i class="fa-regular fa-eye"></i>');
  } else {
    $("#inputPassword").attr("type", "password");
    $("#inputShowPassword").html('<i class="fa-regular fa-eye-slash"></i>');
  }
});
$(".login-intranet #inputEmail").on("keyup", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .parent()
      .next()
      .children("p")
      .text("Cannot leave this field empty")
      .addClass("text-danger");
    return;
  }
  if (!isValidEmail($(this).val())) {
    $(this).next().html('<i class="text-danger fa-solid fa-circle-xmark"></i>');
    $(this)
      .parent()
      .next()
      .children("p")
      .text("Invalid email address !")
      .addClass("text-danger")
      .removeClass("text-transparent");
  } else {
    $(this)
      .next()
      .html('<i class="text-success fa-solid fa-circle-check"></i>');
    $(this)
      .parent()
      .next()
      .children("p")
      .text("Valid email address")
      .addClass("text-success")
      .removeClass("text-danger");
  }
});

$(".login-intranet #inputEmail").on("blur", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .parent()
      .next()
      .children("p")
      .text("Cannot leave this field empty")
      .addClass("text-danger");
    return;
  }
});

$(".login-intranet #inputPassword").on("keyup", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .parent()
      .next()
      .children("p")
      .text("Cannot leave this field empty")
      .addClass("text-danger");
    return;
  }
  $(this)
    .parent()
    .next()
    .children("p")
    .text("---")
    .addClass("text-transparent")
    .removeClass("text-danger");
});
$(".login-intranet #inputPassword").on("blur", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .parent()
      .next()
      .children("p")
      .text("Cannot leave this field empty")
      .addClass("text-danger");
    return;
  }
  $(this)
    .parent()
    .next()
    .children("p")
    .text("---")
    .addClass("text-transparent")
    .removeClass("text-danger");
});

$(".login-intranet #submitbtn").on("click", function (e) {
  e.preventDefault();
  submitFunction();
});

async function submitFunction() {
  if ($("#inputEmail").val().trim() === "") {
    $("#inputEmail")
      .parent()
      .next()
      .children("p")
      .text("Please fill in this field")
      .addClass("text-danger");
    return;
  }
  if ($("#inputPassword").val().trim() === "") {
    $("#inputPassword")
      .parent()
      .next()
      .children("p")
      .text("Please fill in this field")
      .addClass("text-danger");
    return;
  }
  if (!isValidEmail($("#inputEmail").val())) {
    $("#inputEmail")
      .parent()
      .next()
      .children("p")
      .text("Invalid email address !")
      .addClass("text-danger")
      .removeClass("text-transparent");
    return;
  }
  const email = $("#inputEmail").val();
  const password = $("#inputPassword").val();

  const data = JSON.stringify({
    emailAddress: email,
    password: password,
  });

  try {
    const respone = await fetch(`${HTTP_Request_address}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    if (respone.redirected) {
      window.location.href = respone.url;
      return;
    }
    if (!respone.ok) {
      throw new Error("Error submitting form");
    }
    const result = await respone.json();
    if (result.success === false) {
      $("#inputPassword").val("");
      $(".alert-intranet")
        .css("display", "block")
        .removeClass("alert-success")
        .addClass("alert-danger");
      $(".alert-intranet strong").html("Fail ! ");
      $(".alert-intranet span").html(result.message);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("There was an error checking the email. Please try again.");
  }
}
