import { loginApi } from "./api.js";
import { FRONT_BASE_URL } from "./conf.js";

const payload = localStorage.getItem("payload");
const payloadParse = JSON.parse(payload);

if (payloadParse != null) {
  window.location.href = `${FRONT_BASE_URL}/html/index.html`;
}

document.getElementById("btnLogin").addEventListener("click", () => {
  // 로그인
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email: email,
    password: password,
  };

  loginApi(loginData);
});
