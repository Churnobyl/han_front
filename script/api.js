import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";

export async function signupApi(data) {
  // 회원가입 api
  const response = await fetch(`${BACK_BASE_URL}/users/`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  const responseJson = await response.json();
  return { response, responseJson };
}

export async function loginApi(data) {
  // 로그인 api
  const response = await fetch(`${BACK_BASE_URL}/users/login/`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    const responseJson = await response.json();
    localStorage.setItem("access", responseJson.access);
    localStorage.setItem("refresh", responseJson.refresh);

    // payload 저장
    const base64Url = responseJson.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    // localStorage.setItem("payload", jsonPayload);
    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    document.getElementById("password").value = "";
    alert("회원정보가 일치하지 않습니다.");
  }

  return { response, responseJson };
}

export async function getQuizApi(data) {
  // 퀴즈 가져오기 api
  const response = await fetch(`${BACK_BASE_URL}`);
  const responseJson = await response.json();

  return responseJson;
}

export async function getRoomApi() {
  // 배틀 가져오기 api
  const response = await fetch(`${BACK_BASE_URL}/battle/game/`);
  const responseJson = await response.json();
  return { responseJson };
}
