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
      $(".login-intranet form").submit();
    }
  }
});
$("#inputEmail, #inputPassword").on("focus", function () {
  $(this).siblings(".emailalert, .passwordalert").text("");
});
$("#inputShowPassword").on("click", togglePasswordVisibility);
$("#inputEmail").on("blur", () => toggleSubmitButton());
$("#inputPassword").on("blur", () => toggleSubmitButton());
