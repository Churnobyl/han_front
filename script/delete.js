import { deleteUserApi } from "./api.js";

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
