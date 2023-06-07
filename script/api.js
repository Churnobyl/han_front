import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";

// 회원가입 api
export async function signupApi(data) {
  const response = await fetch(`${BACK_BASE_URL}/users/`, {
    method: "POST",
    body: data,
  });
  const responseJson = await response.json();
  console.log(responseJson);
}

// 로그인 api
export async function loginApi(data) {
  const response = await fetch(`${BACK_BASE_URL}/users/`, {
    method: "POST",
    body: data,
  });
  const responseJson = await response.json();
  console.log(responseJson);
}
