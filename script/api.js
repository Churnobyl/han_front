import { BACK_BASE_URL, FRONT_BASE_URL, BACK_WEBSOCKET_URL } from "./conf.js";

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

    // // 쿠키 저장
    // function setCookie(name, value, days) {
    //   const expirationDate = new Date();
    //   expirationDate.setDate(expirationDate.getDate() + days);
    //   const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    //   document.cookie = cookieValue;
    // }

    sessionStorage.setItem("session_data", responseJson.session_data);

    // setCookie("access_token", responseJson.access, 1);

    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    document.getElementById("password").value = "";
    alert("회원정보가 일치하지 않습니다.");
  }

  // return { response, responseJson };
}

export async function getQuizApi(type) {
  // 퀴즈 가져오기 api
  let response;
  let responseJson;
  if (!type) {
    response = await fetch(`${BACK_BASE_URL}/DB/gen/`);
  } else {
    response = await fetch(`${BACK_BASE_URL}/DB/gen/?type=${type}`);
  }
  if (response.status === 200) {
    responseJson = await response.json();
  } else if (response.status === 500) {
    window.location.reload();
  }

  return responseJson;
}

export async function sendQuizResultApi(data) {
  // 퀴즈 결과보내기 api
  const token = localStorage.getItem("access");
  const response = await fetch(`${BACK_BASE_URL}/result/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sendQuizReportApi(data) {
  // 퀴즈 신고하기 api
  const token = localStorage.getItem("access");
  const response = await fetch(`${BACK_BASE_URL}/report/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  return responseJson;
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

export async function makeRoomApi(data) {
  // 방 만들기 api
  const access_token = localStorage.getItem("access");
  const response = await fetch(`${BACK_BASE_URL}/battle/game/`, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
  });
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

    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    alert(responseJsonGoogle.message);
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

    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    alert(responseJsonKakao.message);
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

    window.location.href = `${FRONT_BASE_URL}/html/home.html`;
  } else {
    alert(responseJsonNaver.message);
  }
  return { response, responseJson };
}

export async function sendSuggestApi(data) {
  const token = localStorage.getItem("access");
  const response = await fetch(`${BACK_BASE_URL}/suggest/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (response.status == 201) {
    alert(
      "퀴즈 제출에 성공했습니다.\n\n퀴즈는 관리자의 검토를 거친 뒤 적용됩니다."
    );
    window.location.reload();
  } else {
    alert("퀴즈 제출에 실패했습니다.");
  }
}

export async function sendPasswordResetApi(data) {
  const response = await fetch(`${BACK_BASE_URL}/users/reset/`, {
    headers: {
      "content-type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (response.status == 200) {
    alert(
      "입력해주신 이메일로 초기화 된 비밀번호를 전송했습니다.\n\n로그인 후 반드시 비밀번호를 변경해주세요."
    );

    window.location.href = `${FRONT_BASE_URL}/html/login.html`;
  } else {
    alert(
      "비밀번호 초기화 메일 전송에 실패했습니다.\n\n등록 된 유저가 맞는지 확인해주세요."
    );
  }
}

export async function deleteUserApi() {
  // 토큰 디코딩해서 유저 아이디 값 찾아오기
  const token = localStorage.getItem("access");

  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));

  const userId = decodedPayload["user_id"];

  const response = await fetch(`${BACK_BASE_URL}/users/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify(),
  });
  if (response.status == 200) {
    alert(
      "회원 탈퇴에 성공했습니다.\n\n지금까지 한을 이용해주셔서 감사합니다."
    );
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = `${FRONT_BASE_URL}`;
  } else {
    alert("회원 탈퇴 요청이 정상적으로 이루어지지 않았습니다.");
  }
}

export async function editPasswordApi(data) {
  // 토큰 디코딩해서 유저 아이디 값 찾아오기
  const token = localStorage.getItem("access");

  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));

  const userId = decodedPayload["user_id"];

  const response = await fetch(`${BACK_BASE_URL}/users/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (response.status == 200) {
    alert("비밀번호가 변경되었습니다.");
    window.location.href = `${FRONT_BASE_URL}/html/mypage.html?id=${userId}`;
  } else {
    alert("비밀번호 변경에 실패했습니다.");
  }
}

export async function getRankingApi(link, type) {
  let response
  if (!link) {
    if (!type) {
      response = await fetch(`${BACK_BASE_URL}/users/ranking`);
    } else {
      response = await fetch(`${BACK_BASE_URL}/users/ranking/${type}`);
    }
  } else {
    response = await fetch(link);
  }
  const responseJson = await response.json();
  return responseJson;
}

export async function followApi(id) {
  const token = localStorage.getItem("access");
  const response = await fetch(`${BACK_BASE_URL}/users/follow/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
  });
  if (response.status == 200) {
    alert("친구 추가가 완료되었습니다.");
    window.location.reload();
  } else if (response.status == 204) {
    alert("친구를 끊었습니다.");
    window.location.reload();
  }
}

export async function emailVerifyApi(uidb64, token) {
  const response = await fetch(
    `${BACK_BASE_URL}/users/verify/${uidb64}/${token}`
  );
  return response.status;
}

export async function checkAnonymous() {
  const access = localStorage.getItem("access");

  // 로그인 하지 않은 유저는 접근할 수 없음
  if (access === null) {
    alert("로그인해주세요!");
    window.location.replace(`${FRONT_BASE_URL}/html/login.html`);
  }
}

export async function checkLoginUser() {
  const access = localStorage.getItem("access");

  // 로그인한 유저는 접근할 수 없음
  if (access !== null) {
    alert("이미 로그인 되어 있습니다.");
    window.location.replace(`${FRONT_BASE_URL}/html/home.html`);
  }
}

export let socket;
const token = localStorage.getItem("access");
if (token) {
  const nowPage = window.location.pathname;
  const pageSplit = nowPage.split("/");
  const pageName = pageSplit[pageSplit.length - 1].split(".")[0];
  socket = new WebSocket(
    `ws://${BACK_WEBSOCKET_URL}/ws/battle/?token=${token}&page=${pageName}`
  );
}

if (socket) {
  socket.onmessage = function (e) {
    const notification = JSON.parse(e.data);
    const notificationDrop = document.getElementById("notification-list");
    notification["message"].forEach((element) => {
      const notification = document.createElement("li");
      notification.innerText = `${element.sender}의 겨루기 초대 `;

      const accept = document.createElement("a");
      accept.innerText = "수락";
      accept.setAttribute("data-id", element.id);
      accept.setAttribute("data-room", element.room);
      accept.addEventListener("click", acceptInvitation);
      notification.append(accept);

      const reject = document.createElement("a");
      reject.innerText = "거절";
      reject.setAttribute("data-id", element.id);
      reject.setAttribute("data-room", element.room);
      reject.addEventListener("click", rejectInvitation);
      notification.append(reject);

      notificationDrop.append(notification);
    });
    const notificationDot = document.getElementById("notification-dot");
    if (notification["message"].length != 0) {
      notificationDot.style.visibility = "visible";
    } else {
      notificationDot.style.visibility = "hidden";
    }
  };
}

async function acceptInvitation(e) {
  const invitationId = e.target.getAttribute("data-id");
  const roomName = e.target.getAttribute("data-room");
  socket.send(
    JSON.stringify({
      type: "read_notification",
      notification: invitationId,
    })
  );
  window.location.href = `/html/battle/battle-page.html?room=${roomName}`;
}

async function rejectInvitation(e) {
  const invitationId = e.target.getAttribute("data-id");
  socket.send(
    JSON.stringify({
      type: "read_notification",
      notification: invitationId,
    })
  );
  window.location.reload();
}
