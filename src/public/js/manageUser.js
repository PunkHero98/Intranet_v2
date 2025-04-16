let prevValue = {};
const HTTP_Request_address = "http://localhost:3000";

$("button.backButton").on("click", function () {
  window.history.back();
});

$(".add-Btn").css("display", "none");


function getRowElementsForManageUser(obj) {
  const row = $(obj).closest("tr");
  return {
    role: row.find("td.role"),
    email: row.find("td.email"),
    workingSite: row.find("td.site"),
    isResetPass: row.find("td.is_reset_password"),
    isActivated: row.find("td.is_activated"),
    btnContainer: row.find("td.btn_container"),
  };
}
$(".manage-users").on(
  "click",
  ".table-group-divider td.btn_container .edit_user_Btn",
  async function () {
    const button = $(this);
    const isEditing = button.html() === "Edit";
    const isSaving = button.html() === "Save";
    if (isEditing) {
      collectDataBeforeEdit(button);
      changeEditUserBtn(button, "btn-primary", "btn-success", "Save", 1);
    } else if (isSaving) {
      changeEditUserBtn(button, "btn-success", "btn-primary", "Edit", 0);
      updateToServer(collectEditedUser(button));
    }
  }
);

function changeEditUserBtn(button, prevClass, newClass, innerText, opacity) {
  const { role, workingSite, btnContainer } =
    getRowElementsForManageUser(button);
  $(button)
    .parents("tr")
    .css({
      "background-color": opacity ? "rgba(0, 0, 0, 0.063)" : "",
    });
  var currentRoleText = role.children("span").html();
  var currentRoleValue = role.children("div").children("#roleList").val();
  var currentSiteText = workingSite.children("span").html();
  var currentSiteValue = workingSite
    .children("div")
    .children("#siteList")
    .val();

  if (!opacity) {
    role.children("span").css("display", "block");
    role.children("span").html(currentRoleValue);
    role.children("div").css("display", "none");
    btnContainer.children(".toggleActiveBtn").attr("hidden", true);
    btnContainer.children(".resetBtn").attr("hidden", true);

    workingSite.children("span").css("display", "block");
    workingSite.children("span").html(currentSiteValue);
    workingSite.children("div").css("display", "none");
  } else {
    role.children("span").css("display", "none");
    role.children("div").css("display", "block");
    role.children("div").children("#roleList").val(currentRoleText);
    btnContainer.children(".toggleActiveBtn").removeAttr("hidden");
    btnContainer.children(".resetBtn").removeAttr("hidden");

    workingSite.children("span").css("display", "none");
    workingSite.children("div").css("display", "block");
    workingSite.children("div").children("#siteList").val(currentSiteText);
  }
  button.removeClass(prevClass).addClass(newClass).html(innerText);
}

$(".manage-users").on(
  "click",
  ".table-group-divider td.btn_container .toggleActiveBtn",
  function () {
    const button = $(this);
    const { isActivated } = getRowElementsForManageUser(button);
    if (isActivated.html() == "true") {
      isActivated.html("false");
      button.text("Activated");
      button.removeClass("btn-danger").addClass("btn-success");
    } else {
      isActivated.html("true");
      button.text("Deactivated");
      button.removeClass("btn-success").addClass("btn-danger");
    }
  }
);

$(".manage-users").on(
  "click",
  ".table-group-divider td.btn_container .resetBtn",
  function () {
    const button = $(this);
    const { isResetPass } = getRowElementsForManageUser(button);
    if (isResetPass.html() == "true") {
      isResetPass.html("false");
      button.addClass("btn-danger").removeClass("btn-success");
    } else {
      isResetPass.html("true");
      button.addClass("btn-success").removeClass("btn-danger");
    }
  }
);

function collectDataBeforeEdit(button) {
  const { role, workingSite, isResetPass, isActivated, email } =
    getRowElementsForManageUser(button);
  const roleVal = role.children("span").text();
  const siteVal = workingSite.children("span").text();
  const resetPasVal = isResetPass.text();
  const activeVal = isActivated.text();
  const emailVal = email.text();
  prevValue = {
    email: emailVal,
    user_role: roleVal,
    user_working_site: siteVal,
    is_reset_password: resetPasVal,
    isActivated: activeVal == "true" ? 1 : 0,
  };
}

function collectEditedUser(button) {
  const { role, workingSite, isResetPass, isActivated, email } =
    getRowElementsForManageUser(button);

  const roleVal = role.children("span").text();
  const siteVal = workingSite.children("span").text();
  const resetPasVal = isResetPass.text();
  const activeVal = isActivated.text();
  const emailVal = email.text();
  const data = {
    email: emailVal,
    user_role: roleVal,
    user_working_site: siteVal,
    is_reset_password: resetPasVal,
    isActivated: activeVal == "true" ? 1 : 0,
  };

  return areObjectsEqual(prevValue, data) ? null : JSON.stringify(data);
}

function areObjectsEqual(obj1, obj2) {
  // Kiểm tra nếu obj1 và obj2 có cùng số lượng thuộc tính
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  // Duyệt qua các thuộc tính của obj1
  for (let key in obj1) {
    // Kiểm tra nếu thuộc tính không tồn tại trong obj2 hoặc giá trị không giống nhau
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
async function updateToServer(obj) {
  try {
    if (obj == null) return;
    const respone = await fetch(`${HTTP_Request_address}/manage/user_updated`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: obj,
    });
    if (!respone.ok) {
      throw new Error("Error submitting form");
    }
    const responseText = await respone.json();
    if (responseText.success === false) {
      $(".alert-intranet")
        .css("display", "block")
        .removeClass("alert-success")
        .addClass("alert-danger");
      $(".alert-intranet strong").html("Fail ! ");
      $(".alert-intranet span").html(responseText.message);
    } else {
      $(".alert-intranet")
        .css("display", "block")
        .removeClass("alert-danger")
        .addClass("alert-success");
      $(".alert-intranet strong").html("Success ! ");
      $(".alert-intranet span").html(responseText.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    console.log(responseText);
  } catch (err) {
    console.error("Error:", err);
    alert("There was an error updating user. Please try again.");
  }
}
