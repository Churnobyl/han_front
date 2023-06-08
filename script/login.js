import { loginApi } from "./api.js";

// 로그인
document.getElementById("btnLogin").addEventListener("click", () => {
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
