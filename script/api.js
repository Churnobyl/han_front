import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";

export async function signupApi(data) {
  // 회원가입 api
  const response = await fetch(`${BACK_BASE_URL}/users/`, {
    headers:{
      'content-type':'application/json',
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  console.log(responseJson);
}

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
  console.log(responseJson);
}
