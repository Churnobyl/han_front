import { FRONT_BASE_URL, BACK_BASE_URL } from "./conf.js";
import { followApi, getUserProfile, checkAnonymous } from "./api.js";

checkAnonymous();

const urlParams = new URL(location.href).searchParams;
const profileId = urlParams.get("id");

window.onload = async function loadProfile() {
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
  const myId = jsonPayload["user_id"];

  const myProfile = await getUserProfile(myId);
  const userProfile = await getUserProfile(profileId);

  // 프로필 보여주기
  document.getElementById(
    "userEmail"
  ).innerText = `이메일 : ${userProfile["유저"]["email"]}`;
  document.getElementById(
    "userName"
  ).innerText = `별명 : ${userProfile["유저"]["username"]}`;
  document.getElementById(
    "userDay"
  ).innerText = `총 학습 일수 : ${userProfile["정보"]["total_study_day"]}일`;
  document.getElementById(
    "userLevel"
  ).innerText = `레벨 ${userProfile["정보"]["level"]} (${userProfile["정보"]["experiment"]}/${userProfile["정보"]["max_experiment"]})`;

  const expProgress = document.getElementById("exp");
  expProgress.setAttribute("max", userProfile["정보"]["max_experiment"]);
  expProgress.setAttribute("value", userProfile["정보"]["experiment"]);

  // 프로필 사진 보여주기
  const profileImage = document.getElementById("profileImage");
  if (userProfile["유저"]["image"] !== null) {
    profileImage.src = `${BACK_BASE_URL}${userProfile["유저"]["image"]}`;
  }

  //착용 칭호 보여주기
  const wearAchieve = document.getElementById("wearAchieve");
  if (userProfile["칭호"] === "null") {
    wearAchieve.innerText = "착용 칭호가 없습니다.";
  } else {
    wearAchieve.innerHTML = `<img src=/${userProfile["칭호"]["image_url"]}>${userProfile["칭호"]["title"]}`;
  }

  //칭호 보여주기
  const userAchievement = document.getElementById("userAchievement");
  userProfile["유저"]["achieve"].forEach((achieve) => {
    const achieveDiv = document.createElement("div");
    achieveDiv.setAttribute("class", "achievement");
    const achieveTitle = document.createElement("p");
    achieveTitle.setAttribute("class", "achieve-title");
    achieveTitle.innerHTML = `<img src=/${achieve["image_url"]}>${achieve["title"]}`;
    const achieveContent = document.createElement("p");
    achieveContent.innerText = achieve["comment"];
    achieveDiv.appendChild(achieveTitle);
    achieveDiv.appendChild(achieveContent);
    userAchievement.appendChild(achieveDiv);
  });
  // 팔로우 버튼

  const followBtn = document.getElementById("followBtn");
  if (myId == profileId) {
    followBtn.remove();
  }

  // 팔로우 보여주기
  const following = document.getElementById("following");
  if (userProfile["유저"]["followings"].length === 0) {
    following.innerHTML = "<p>친구가 없습니다...</p>";
  } else {
    userProfile["유저"]["followings"].forEach((follow) => {
      const followingA = document.createElement("a");
      followingA.setAttribute(
        "href",
        `${FRONT_BASE_URL}/html/mypage.html?id=${follow["id"]}`
      );
      followingA.innerText = follow["username"];
      following.appendChild(followingA);
    });
  }
  // 팔로우되어 있는지 찾기
  myProfile["유저"]["followings"].forEach((find) => {
    if (find["id"] === parseInt(profileId)) {
      followBtn.innerText = "친구 끊기";
    } else {
      followBtn.innerText = "친구 추가";
    }
  });

  // 수정버튼 보여주기
  const profileEditBtn = document.getElementById("profileEditBtn");
  if (String(jsonPayload.user_id) === profileId) {
    profileEditBtn.style.display = "inline";
  } else {
    profileEditBtn.style.display = "none";
  }
};

document
  .getElementById("profileEditBtn")
  .addEventListener("click", function () {
    window.location.href = `${FRONT_BASE_URL}/html/edit_page.html?id=${profileId}`;
  });
document.getElementById("followBtn").addEventListener("click", function () {
  followApi(profileId);
});
