import { loginApi } from "./api.js";

document.getElementById("btnLogin").addEventListener("click", () => {
  // 로그인
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    "email": email,
    "password": password
  };

  try {
    const response = loginApi(loginData);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
);
