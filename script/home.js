import { FRONT_BASE_URL, BACK_BASE_URL } from "./conf.js";
import { googleLogin, kakaoLogin, naverLogin } from "./api.js";

window.onload = () => {
    const search = window.location.search;
    console.log(search);
    if (search.includes("google")) {
      googleLoginSend(search)
    }
    else if (search.includes("state")) {
      naverLoginSend(search)
    }
    else if (search.includes("code")) {
      kakaoLoginSend(search)
    }
};

async function googleLoginSend(search) {
    const response = await googleLogin(search);
};
  
async function kakaoLoginSend(search) {
    const response = await kakaoLogin(search);
};
  
async function naverLoginSend(search) {
    const response = await naverLogin(search);
};

async function homePage() {
    const access = localStorage.getItem("access");
    const base64Url = access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayloadString = decodeURIComponent(
        atob(base64)
        .split("")
        .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const jsonPayload = JSON.parse(jsonPayloadString);
    const response = await fetch(`${BACK_BASE_URL}/users/${jsonPayload["user_id"]}/`, {
        method:"GET",
    })
    const responseJson = await response.json();
    console.log(responseJson)

    // 연속 학습일수 노출
    const userDays = document.getElementById("userDays")
    userDays.innerText = `${responseJson["유저"]["username"]}님은 현재 연속 ${responseJson["정보"]["day"]}일째 학습중입니다.`

    // 친구 목록 노출
    const userFriend = document.getElementById("userFriend")
    responseJson["유저"]["followings"].forEach(follow => {
        const friendP = document.createElement("p")
        const friendA = document.createElement("a")
        friendA.setAttribute("href", `${FRONT_BASE_URL}/html/mypage.html?id=${follow["id"]}`)
        friendA.innerText = follow["username"]
        friendP.appendChild(friendA)
        userFriend.appendChild(friendP)
    })
}

homePage();

document.getElementById("myPageMove").addEventListener("click", handleMoveMyPage);

function handleMoveMyPage() {
    window.location.href = `${FRONT_BASE_URL}/html/mypage.html?id=${jsonPayload["user_id"]}`
}