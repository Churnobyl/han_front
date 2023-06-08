import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";

// 회원가입 api
export async function signupApi(data) {
  const response = await fetch(`${BACK_BASE_URL}/users/`, {
    headers:{
      'content-type':'application/json',
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  console.log(responseJson);
  // 회원가입 후 이동 페이지 넣어야함
}

// 로그인 api
export async function loginApi(data) {
  console.log(data)
  const response = await fetch(`${BACK_BASE_URL}/users/login/`, {
    headers:{
      'content-type':'application/json',
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();

  localStorage.setItem("access", responseJson.access);
  localStorage.setItem("refresh", responseJson.refresh);

  const base64Url = responseJson.access.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  localStorage.setItem("payload", jsonPayload);
  // 로그인 후 이동 페이지 넣어야함
}
