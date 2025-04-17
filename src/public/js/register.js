const HTTP_Request_address = "http://localhost:3000";
let isEmailChecked = true;
const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};
const validatePassword = (password) => {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>~\-_=+\[\]\\;`'\/])[A-Za-z\d!@#$%^&*(),.?":{}|<>~\-_=+\[\]\\;`'\/]{8,}$/;
  return regex.test(password);
};

$(document).ready(function () {
  $('.feedBackBtn').css("display", "none");
});


$(".register-intranet #regis-fullname").on("blur", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .next()
      .children("p")
      .text("Cannot leave this field blank !")
      .addClass("text-danger")
      .removeClass("text-transparent");
    return;
  }
  $(this)
    .next()
    .children("p")
    .text("---")
    .removeClass("text-danger")
    .addClass("text-transparent");
});

$(".register-intranet #regis-position").on("blur", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .next()
      .next()
      .children("p")
      .text("Cannot leave this field blank !")
      .addClass("text-danger")
      .removeClass("text-transparent");
    return;
  }
  $(this)
    .next()
    .next()
    .children("p")
    .text("----")
    .removeClass("text-danger")
    .addClass("text-transparent");
});
$(".register-intranet #submitbtn ").on("click", async function () {
  const fullname = $("#regis-fullname");
  const email = $("#regis-email");
  const pass = $("#regis-pass");
  const role = $("#regis-role");
  const confirmPas = $("#regis-confirmPas");
  const department = $("#datalistOptions6");
  const site = $("#datalistOptions4");
  const address = $("#datalistOptions5");
  const position = $("#regis-position");
  const phone = $("#regis-phone");
  const formArrraySimple = [fullname, confirmPas, phone];
  const formArrayComplex = [email, pass];
  let isValid = true;

  formArrraySimple.forEach((f) => {
    if (f.val().trim() === "") {
      f.next()
        .children("p")
        .text("Cannot leave this field blank !")
        .addClass("text-danger")
        .removeClass("text-transparent");
      isValid = false;
    } else {
      f.next()
        .children("p")
        .text("---")
        .removeClass("text-danger")
        .addClass("text-transparent");
    }
  });

  formArrayComplex.forEach((f) => {
    if (f.val().trim() === "") {
      f.parent()
        .next()
        .children("p")
        .text("Cannot leave this field blank !")
        .addClass("text-danger")
        .removeClass("text-transparent")
        .removeClass("text-success");
      isValid = false;
    }
  });
  if (position.val().trim() === "") {
    position
      .next()
      .next()
      .children("p")
      .text("Cannot leave this field blank !")
      .addClass("text-danger");
    isValid = false;
  }
  if (!isValid) {
    return;
  }

  if (!isValidEmail(email.val())) {
    email
      .parent()
      .next()
      .children("p")
      .text("Invalid Email")
      .addClass("text-danger");
    email.focus();
    return;
  }
  if (!isEmailChecked) {
    email
      .parent()
      .next()
      .children("p")
      .text("Email is already taken")
      .addClass("text-danger");
    email.focus();
    return;
  }
  if (!validatePassword(pass.val())) {
    pass
      .parent()
      .next()
      .children("p")
      .text("Invalid Password")
      .addClass("text-danger");
    pass.focus();
    return;
  }
  if (pass.val() !== confirmPas.val()) {
    confirmPas
      .parent()
      .next()
      .children("p")
      .text("Password does not match")
      .addClass("text-danger");
    confirmPas.focus();
    return;
  }

  try {
    const data = JSON.stringify({
      fullname: fullname.val(),
      email: email.val(),
      user_password: pass.val(),
      user_role: role.val(),
      department: department.val(),
      position: position.val(),
      user_working_site: site.val(),
      user_address: address.val(),
      office_phone_number: phone.val(),
    });
    const respone = await fetch(`${HTTP_Request_address}/register/tfa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    if (!respone.ok) {
      throw new Error("Error submitting form");
    }
    const result = await respone.json();
    if (result.success === false) {
      $(".alert-intranet")
        .css("display", "block")
        .removeClass("alert-success")
        .addClass("alert-danger");
      $(".alert-intranet strong").html("Fail ! Please try again later ! ");
      $(".alert-intranet span").html(result.message);
    } else {
      $(".alert-intranet")
        .css("display", "block")
        .removeClass("alert-danger")
        .addClass("alert-success");
      $(".alert-intranet strong").html("Success ! Redirecting to login page");
      $(".alert-intranet span").html(result.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("There was an error checking the email. Please try again.");
  }
});
$(".register-intranet #regis-position").on("blur", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .next()
      .text("Cannot leave this field blank !")
      .addClass("text-danger");
    return;
  }
  $(this).next().text("").removeClass("text-danger");
});
$(".register-intranet #regis-phone").on("blur", function () {
  if ($(this).val().trim() === "") {
    $(this)
      .next()
      .text("Cannot leave this field blank !")
      .addClass("text-danger");
    return;
  }
  $(this).next().text("").removeClass("text-danger");
});
$(".register-intranet #registerForm").on("submit", function (event) {
  event.preventDefault();
});
$(".register-intranet #regis-email").on("keyup", function () {
  checkRegisEmail($(this));
});
$(".register-intranet .password .input-group button").on("click", function () {
  const currentState = $(this).children().hasClass("fa-eye-slash");
  if (currentState) {
    $(this).children().removeClass("fa-eye-slash").addClass("fa-eye");
    $(this).prev().attr("type", "text");
    return;
  }
  $(this).children().removeClass("fa-eye").addClass("fa-eye-slash");
  $(this).prev().attr("type", "password");
});
$(".register-intranet #regis-pass").on("keyup", function () {
  const valiPass = validatePassword($(this).val());
  if (!($(this).val().trim() === "")) {
    if (!valiPass) {
      $(this).parent().next().children("p").text("invalid Password");
      $(this).parent().next().children("p").addClass("text-danger");
      return;
    }
  } else {
    $(this).parent().next().children("p").text("Cannot leave blank Password");
    $(this).parent().next().children("p").addClass("text-danger");
    return;
  }
  $(this).parent().next().children("p").text("Valid Password");
  $(this)
    .parent()
    .next()
    .children("p")
    .removeClass("text-danger")
    .addClass("text-success");
});
$(".register-intranet #regis-confirmPas").on("keyup", function () {
  const emailVal = $("#regis-pass").val();
  if (emailVal.trim() === "") {
    $(this)
      .next()
      .children("p")
      .text("Cannot leave the password field blank")
      .addClass("text-danger");
    return;
  }
  if (!(emailVal.trim() === $(this).val().trim())) {
    $(this)
      .next()
      .children("p")
      .text("Password does not match!")
      .addClass("text-danger");
    return;
  }
  $(this)
    .next()
    .children("p")
    .text("Match")
    .removeClass("text-danger")
    .addClass("text-success");
});
$(".register-intranet #regis-email").on("blur", async function () {
  if (!checkRegisEmail($(this))) {
    $(this).focus();
    return;
  }
  const emailVal = $(this).val();

  try {
    $(this).next().html('<i class="fa-solid fa-spinner fa-spin"></i>');
    const respone = await fetch(
      `${HTTP_Request_address}/register/check-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal }),
      }
    );
    if (!respone.ok) {
      throw new Error("Error submitting form");
    }
    const data = await respone.json();

    if (data.success === false) {
      $(this)
        .parent()
        .next()
        .children("p")
        .text(data.message)
        .addClass("text-primary");
      isEmailChecked = true;
      $(this)
        .next()
        .html('<i class="text-success fa-solid fa-circle-check"></i>');
    } else {
      $(this)
        .parent()
        .next()
        .children("p")
        .text(data.message)
        .addClass("text-danger");
      isEmailChecked = false;
      $(this)
        .next()
        .html('<i class="text-danger fa-solid fa-circle-xmark"></i>');
    }

  } catch (err) {
    console.error("Error:", error);
    alert("There was an error checking the email. Please try again.");
  }
});

$(".register-intranet .backBtn").on("click", function () {
  window.location.href = "/login";
});

function checkRegisEmail(email) {
  if (email.val().trim() === "") {
    return false;
  }
  const emailval = isValidEmail(email.val());

  if (!emailval) {
    email.parent().next().children("p").text("Invalid Email");
    email.parent().next().children("p").addClass("text-danger");
    return false;
  }
  email
    .parent()
    .next()
    .children("p")
    .removeClass("text-danger")
    .addClass("text-success");
  email.parent().next().children("p").text("Valid Email");
  return true;
}
