const HTTP_Request_address = "http://localhost:3000";

const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

let passwordVisible = false;

function togglePasswordVisibility() {
  $("#inputPassword").attr("type", passwordVisible ? "password" : "text");
  passwordVisible = !passwordVisible;
}

function handleInputBlur(input, alertSelector, validationFunc = null) {
  const value = input.val();
  const alertMessage =
    value === ""
      ? "Cannot leave this field blank!"
      : validationFunc && !validationFunc(value)
      ? "Provide a valid email address"
      : "";
  $(alertSelector).text(alertMessage);
}

function toggleSubmitButton() {
  const isEmailValid =
    $("#inputEmail").val() !== "" && isValidEmail($("#inputEmail").val());
  const isPasswordValid = $("#inputPassword").val() !== "";
  $("#submitbtn").prop("disabled", !(isEmailValid && isPasswordValid));
}

$("#inputEmail").on("blur", function () {
  handleInputBlur($(this), ".login-intranet .emailalert", isValidEmail);
});

$("#inputPassword").on("blur", function () {
  handleInputBlur($(this), ".login-intranet .passwordalert");
  toggleSubmitButton();
});

$("#inputPassword").on("keyup", function (e) {
  if (e.key === "Enter") {
    toggleSubmitButton();
    if (!$("#submitbtn").prop("disabled")) {
      submitFunction();
    }
  }
});
$("#inputEmail, #inputPassword").on("focus", function () {
  $(this).siblings(".emailalert, .passwordalert").text("");
});
$("#inputShowPassword").on("click", togglePasswordVisibility);
$("#inputEmail").on("blur", () => toggleSubmitButton());
$("#inputPassword").on("blur", () => toggleSubmitButton());

$(".login-intranet #submitbtn").on("click", function (e) {
  e.preventDefault();
  submitFunction();
});

async function submitFunction() {
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
