import { deleteUserApi } from "./api.js";
import { FRONT_BASE_URL } from "./conf.js";

// 버튼 클릭 시 함수 작동
document
  .getElementById("delete-btn")
  .addEventListener("click", handleDeleteUser);

function handleDeleteUser() {
  const checkBox = document.getElementById("checkbox");
  if (checkBox.checked == false) {
    alert("탈퇴를 원하시면 체크박스에 표시해주세요.");
    return;
  } else {
    deleteUserApi();
  }
}

window.onload = function () {
  let fromBtn = false;
  if (localStorage.getItem("btnHref") === "true") {
    fromBtn = true;
  }

  localStorage.removeItem("btnHref");

  const token = localStorage.getItem("access");
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));

  document.getElementById(
    "user-email"
  ).innerText = `(${decodedPayload["email"]})`;

  if (!fromBtn) {
    alert("잘못된 접근입니다.");
    window.location.replace(`${FRONT_BASE_URL}/html/home.html`);
  }
};
