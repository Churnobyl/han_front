import { loginApi } from "./api.js";

document.getElementById("btnLogin").addEventListener("click", () => {
  // 로그인
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const response = loginApi(formData);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});
