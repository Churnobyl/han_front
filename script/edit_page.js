import { FRONT_BASE_URL, BACK_BASE_URL } from "./conf.js";
import { getUserProfile, editUserProfile, checkAnonymous } from "./api.js";

checkAnonymous();

window.onload = async function loadProfile() {
  const urlParams = new URL(location.href).searchParams;
  const userId = urlParams.get("id");
  const userProfile = await getUserProfile(userId);

  // 프로필 보여주기
  document.getElementById(
    "userEmail"
  ).innerText = `이메일 : ${userProfile["유저"]["email"]}`;
  document.getElementById(
    "userName"
  ).innerHTML = `별명 : <input type="text" name="username" id="username" value=${userProfile["유저"]["username"]}>`;
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
  const achieveRadio = document.getElementById("achieveRadio");
  userProfile["유저"]["achieve"].forEach((achieve) => {
    const achieveLabel = document.createElement("label");
    achieveLabel.setAttribute("class", "achieve-show");
    const achieveSpan = document.createElement("span");
    achieveSpan.innerHTML = `<img src=/${achieve["image_url"]}>${achieve["title"]}`;
    const achieveP = document.createElement("p");
    achieveP.innerText = achieve["comment"];
    if (userProfile["유저"]["wear_achievement"] === achieve["id"]) {
      achieveLabel.innerHTML = `<input type="radio" name="wear-achievement" value=${achieve["id"]} checked>`;
    } else {
      achieveLabel.innerHTML = `<input type="radio" name="wear-achievement" value=${achieve["id"]}>`;
    }
    achieveLabel.appendChild(achieveSpan);
    achieveLabel.appendChild(achieveP);
    achieveRadio.appendChild(achieveLabel);
  });
};

document.getElementById("profileEdit").addEventListener("click", handleEdit);
document.getElementById("myPageMove").addEventListener("click", handleMyPage);

async function handleEdit() {
  const urlParams = new URL(location.href).searchParams;
  const userId = urlParams.get("id");

  const username = document.getElementById("username").value;
  if (!username) {
    alert("닉네임은 공백으로 사용할 수 없습니다.");
    return;
  }
  const achieveChecked = document.getElementById("achieveRadio");
  const profileImage = document.getElementById("profileImage").src;
  const data = {};

  if (profileImage.includes("data")) {
    if (
      achieveChecked.querySelector('input[name="wear-achievement"]:checked') !==
      null
    ) {
      const wearAchievement = achieveChecked.querySelector(
        'input[name="wear-achievement"]:checked'
      ).value;
      data["username"] = username;
      data["wear_achievement"] = wearAchievement;
      data["image"] = profileImage;
    } else {
      data["username"] = username;
      data["image"] = profileImage;
    }
  } else {
    if (
      achieveChecked.querySelector('input[name="wear-achievement"]:checked') !==
      null
    ) {
      const wearAchievement = achieveChecked.querySelector(
        'input[name="wear-achievement"]:checked'
      ).value;
      data["username"] = username;
      data["wear_achievement"] = wearAchievement;
    } else {
      data["username"] = username;
    }
  }

  editUserProfile(userId, data);
}

function handleMyPage() {
  const urlParams = new URL(location.href).searchParams;
  const userId = urlParams.get("id");
  window.location.href = `${FRONT_BASE_URL}/html/mypage.html?id=${userId}`;
}

document.querySelector(".drawal-btn").addEventListener("click", goDeleteUser);
document.querySelector(".pass-edit").addEventListener("click", goEditPassword);

function goDeleteUser() {
  localStorage.setItem("btnHref", "true");
  window.location.href = `${FRONT_BASE_URL}/html/delete.html`;
}

function goEditPassword() {
  localStorage.setItem("btnHref", "true");
  window.location.href = `${FRONT_BASE_URL}/html/edit_pw.html`;
}
