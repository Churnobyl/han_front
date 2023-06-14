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
  const responseJson = await response.json();

  if (response.status === 200) {
    localStorage.setItem("access", responseJson.access);
    localStorage.setItem("refresh", responseJson.refresh);

    // 쿠키 저장
    function setCookie(name, value, days) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
      document.cookie = cookieValue;
    }

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

    setCookie("access_token", responseJson.access, 1);

    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    document.getElementById("password").value = "";
    alert("회원정보가 일치하지 않습니다.");
  }

  // return { response, responseJson };
}

export async function getQuizApi() {
  // 퀴즈 가져오기 api
  const response = await fetch(`${BACK_BASE_URL}`);
  const responseJson = await response.json();

  return responseJson;
}

export async function sendQuizResultApi(data) {
  // 퀴즈 결과보내기 api
  const token = localStorage.getItem("access");
  const response = await fetch(`${BACK_BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getRoomApi() {
  // 배틀 가져오기 api
  const response = await fetch(`${BACK_BASE_URL}/battle/game/`);
  const responseJson = await response.json();
  return { response, responseJson };
}

export async function getRoomDetailApi(data) {
  // 방 상세정보 가져오기 api
  const response = await fetch(`${BACK_BASE_URL}/battle/game/${data}/`);
  const responseJson = await response.json();
  return { response, responseJson };
}

export async function googleLogin(search) {
  const response = await fetch(
    `${BACK_BASE_URL}/users/google/callback/` + search + "/"
  );
  const responseJson = await response.json();

  const responseGoogle = await fetch(
    `${BACK_BASE_URL}/users/google/login/finish/`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(responseJson),
    }
  );
  const responseJsonGoogle = await responseGoogle.json();

  if (responseGoogle.status === 200) {
    // 쿠키 저장
    function setCookie(name, value, days) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
      document.cookie = cookieValue;
    }

    localStorage.setItem("access", responseJsonGoogle.access);
    localStorage.setItem("refresh", responseJsonGoogle.refresh);
    setCookie("access_token", responseJsonGoogle.access, 1);

    // payload 저장
    const base64Url = responseJsonGoogle.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    localStorage.setItem("payload", jsonPayload);
    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    alert("소셜 로그인에 실패했습니다.");
  }
  return { response, responseJson };
}

export async function kakaoLogin(search) {
  const response = await fetch(
    `${BACK_BASE_URL}/users/kakao/callback/${search}`
  );
  const responseJson = await response.json();

  const responseKakao = await fetch(
    `${BACK_BASE_URL}/users/kakao/login/finish/`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(responseJson),
    }
  );
  const responseJsonKakao = await responseKakao.json();
  console.log(responseJsonKakao);

  if (responseKakao.status === 200) {
    // 쿠키 저장
    function setCookie(name, value, days) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
      document.cookie = cookieValue;
    }

    localStorage.setItem("access", responseJsonKakao.access);
    localStorage.setItem("refresh", responseJsonKakao.refresh);
    setCookie("access_token", responseJsonKakao.access, 1);

    // payload 저장
    const base64Url = responseJsonKakao.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    localStorage.setItem("payload", jsonPayload);
    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    alert("소셜 로그인에 실패했습니다.");
  }
  return { response, responseJson };
}

export async function naverLogin(search) {
  const response = await fetch(
    `${BACK_BASE_URL}/users/naver/callback/${search}`
  );
  const responseJson = await response.json();

  const responseNaver = await fetch(
    `${BACK_BASE_URL}/users/naver/login/finish/`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(responseJson),
    }
  );
  const responseJsonNaver = await responseNaver.json();
  console.log(responseJsonNaver);

  if (responseNaver.status === 200) {
    // 쿠키 저장
    function setCookie(name, value, days) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
      document.cookie = cookieValue;
    }

    localStorage.setItem("access", responseJsonNaver.access);
    localStorage.setItem("refresh", responseJsonNaver.refresh);
    setCookie("access_token", responseJsonNaver.access, 1);

    // payload 저장
    const base64Url = responseJsonNaver.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    localStorage.setItem("payload", jsonPayload);

    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    alert("소셜 로그인에 실패했습니다.");
  }
  return { response, responseJson };
}
