import { emailVerifyApi } from "./api.js";
import { FRONT_BASE_URL } from "./conf.js";

const activateWrap = document.getElementsByClassName("activate-wrap")[0];
const spinner = document.getElementById("spinner");

const urlParams = new URL(location.href).searchParams;
const uidb64 = urlParams.get("verify");
const token = urlParams.get("token");

window.onload = async function () {
  activateWrap.style = "display: none;";

  const status = await emailVerifyApi(uidb64, token);

  if (status == 200) {
    spinner.style = "display: none;";
    document.getElementById("login-btn").addEventListener("click", function () {
      window.location.replace(`${FRONT_BASE_URL}/html/login.html`);
    });
    activateWrap.style = "display: block;";
  } else {
    alert("인증에 실패했습니다.\n\n관리자에게 문의해주세요.");
    window.location.replace(`${FRONT_BASE_URL}`);
  }
};
