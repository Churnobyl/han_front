import { sendPasswordResetApi, checkAnonymous } from "./api.js";

checkAnonymous();

// 버튼 클릭 시 함수 작동
document.getElementById("btnPassword").addEventListener("click", handleReset);

function handleReset() {
  const email = document.getElementById("email").value;
  // 칸이 비어있을 때
  if (email === "") {
    alert("이메일을 입력해주세요!");
    return;
  }

  const resetData = {
    email: email,
  };

  sendPasswordResetApi(resetData);
}
