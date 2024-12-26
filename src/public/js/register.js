const HTTP_Request_address = "http://localhost:3000";

const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};
const validatePassword = (password) => {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return regex.test(password);
};
$(".register-intranet #submitbtn ").on("click", async function () {
  const fullname = $("#regis-fullname");
  const email = $("#regis-email");
  const pass = $("#regis-pass");
  const role = $("#datalistOptions1");
  const confirmPas = $("#regis-confirmPas");
  const department = $("#datalistOptions2");
  const site = $("#datalistOptions4");
  const address = $("#datalistOptions5");
  const position = $("#regis-position");
  const phone = $("#regis-phone");
  const formArrraySimple = [fullname, confirmPas, position, phone];
  const formArrayComplex = [email, pass];

  let isValid = true;

  formArrraySimple.forEach((f) => {
    if (f.val().trim() === "") {
      f.next().text("Cannot leave this field blank !").addClass("text-danger");
      isValid = false;
    } else {
      f.next().text("").removeClass("text-danger");
    }
  });

  formArrayComplex.forEach((f) => {
    if (f.val().trim() === "") {
      f.parent()
        .next()
        .children("span")
        .text("Cannot leave this field blank !")
        .addClass("text-danger");
      isValid = false;
    } else {
      f.parent().next().children("span").text("").removeClass("text-danger");
    }
  });

  if (!isValid) {
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
      alert(result.message);
    } else {
      alert(result.message);
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
      $(this).parent().next().children("span").text("invalid Password");
      $(this).parent().next().children("span").addClass("text-danger");
      return;
    }
  } else {
    $(this)
      .parent()
      .next()
      .children("span")
      .text("Cannot leave blank Password");
    $(this).parent().next().children("span").addClass("text-danger");
    return;
  }
  $(this).parent().next().children("span").text("");
  $(this).parent().next().children("span").removeClass("text-danger");
});
$(".register-intranet #regis-confirmPas").on("keyup", function () {
  const emailVal = $("#regis-pass").val();
  if (emailVal.trim() === "") {
    $(this)
      .next()
      .text("Cannot leave the password field blank")
      .addClass("text-danger");
    return;
  }
  if (!(emailVal.trim() === $(this).val().trim())) {
    $(this).next().text("Password does not match!").addClass("text-danger");
    return;
  }
  $(this).next().text("").removeClass("text-danger");
});
$(".register-intranet .email .input-group button").on(
  "click",
  async function () {
    if (!checkRegisEmail($(this).prev())) {
      $(this).prev().focus();
      return;
    }
    const emailVal = $(this).prev().val();

    try {
      $(this).html('<i class="fa-solid fa-spinner fa-spin"></i>');
      const respone = await fetch(
        "http://localhost:3000/register/check-email",
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

      setTimeout(() => {
        $(this).text("Check");
        if (data.success === false) {
          $(this)
            .parent()
            .next()
            .children("span")
            .text(data.message)
            .addClass("text-primary");
        } else {
          $(this)
            .parent()
            .next()
            .children("span")
            .text(data.message)
            .addClass("text-danger");
        }
      }, 1000);

      console.log(data);
    } catch (err) {
      console.error("Error:", error);
      alert("There was an error checking the email. Please try again.");
    }
  }
);
function checkRegisEmail(email) {
  const emailval = isValidEmail(email.val());

  if (!emailval) {
    email.parent().next().children("span").text("Invalid Email");
    email.parent().next().children("span").addClass("text-danger");
    return false;
  }
  email.parent().next().children("span").removeClass("text-danger");
  email.parent().next().children("span").text("");
  return true;
}
