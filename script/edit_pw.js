import { editPasswordApi } from "./api.js";

// 버튼 클릭 시 함수 작동
document
  .getElementById("btnPassword")
  .addEventListener("click", handleEditPassword);

function handleEditPassword() {
  const newPw = document.getElementById("new-pw").value;
  const checkPw = document.getElementById("check-pw").value;

  if (newPw === "" || checkPw === "") {
    alert("비밀번호 칸을 모두 채워주세요.");
  } else if (newPw != checkPw) {
    alert("입력한 두 비밀번호가 일치하지 않습니다.");
  } else {
    const editData = {
      password: newPw,
    };

    editPasswordApi(editData);
  }
}

window.onload = function () {
  let fromBtn = false;
  if (localStorage.getItem("btnHref") === "true") {
    fromBtn = true;
  }

  localStorage.removeItem("btnHref");

  if (!fromBtn) {
    alert("잘못된 접근입니다.");
    window.location.replace(`${FRONT_BASE_URL}/html/home.html`);
  }
};
