import { FRONT_BASE_URL, BACK_BASE_URL, checkAnonymous } from "./conf.js";

checkAnonymous();

window.onload = async function loadProfile() {
  const urlParams = new URL(location.href).searchParams;
  const userId = urlParams.get("id");
  const response = await fetch(`${BACK_BASE_URL}/users/${userId}/`, {
    method: "GET",
  });
  const responseJson = await response.json();
  console.log(responseJson);

  // 프로필 보여주기
  document.getElementById(
    "userEmail"
  ).innerText = `이메일 : ${responseJson["유저"]["email"]}`;
  document.getElementById(
    "userName"
  ).innerHTML = `별명 : <input type="text" name="username" id="username" value=${responseJson["유저"]["username"]}>`;
  document.getElementById(
    "userLevel"
  ).innerText = `레벨 ${responseJson["정보"]["level"]} (${responseJson["정보"]["experiment"]}/${responseJson["정보"]["max_experiment"]})`;

  const expProgress = document.getElementById("exp");
  expProgress.setAttribute("max", responseJson["정보"]["max_experiment"]);
  expProgress.setAttribute("value", responseJson["정보"]["experiment"]);

  // 프로필 사진 보여주기
  const profileImage = document.getElementById("profileImage");
  if (responseJson["유저"]["image"] !== null) {
    profileImage.src = `${BACK_BASE_URL}${responseJson["유저"]["image"]}`;
  }

  //착용 칭호 보여주기
  const wearAchieve = document.getElementById("wearAchieve");
  if (responseJson["칭호"] === "null") {
    wearAchieve.innerText = "착용 칭호가 없습니다.";
  } else {
    wearAchieve.innerText = responseJson["칭호"]["title"];
  }

  //칭호 보여주기
  const achieveRadio = document.getElementById("achieveRadio");
  responseJson["유저"]["achieve"].forEach((achieve) => {
    console.log(achieve);
    const achieveLabel = document.createElement("label");
    achieveLabel.setAttribute("class", "achieve-show");
    const achieveSpan = document.createElement("span");
    achieveSpan.innerText = achieve["title"];
    const achieveP = document.createElement("p");
    achieveP.innerText = achieve["comment"];
    if (responseJson["유저"]["wear_achievement"] === achieve["id"]) {
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
  const achieveChecked = document.getElementById("achieveRadio");
  const profileImage = document.getElementById("profileImage").src;
  const data = {};
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

  const response = await fetch(`${BACK_BASE_URL}/users/${userId}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
      "content-type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  console.log(responseJson);
  if (responseJson === "수정완료") {
    alert(responseJson["message"]);
  } else {
    alert(responseJson["message"]);
  }
  window.location.href = `${FRONT_BASE_URL}/html/mypage.html?id=${userId}`;
}

function handleMyPage() {
  const urlParams = new URL(location.href).searchParams;
  const userId = urlParams.get("id");
  window.location.href = `${FRONT_BASE_URL}/html/mypage.html?id=${userId}`;
}

document
  .getElementsByClassName("drawal-btn")[0]
  .addEventListener("click", goDeleteUser);
document
  .getElementsByClassName("pass-edit")[0]
  .addEventListener("click", goEditPassword);

function goDeleteUser() {
  localStorage.setItem("btnHref", "true");
  window.location.href = `${FRONT_BASE_URL}/html/delete.html`;
}

function goEditPassword() {
  localStorage.setItem("btnHref", "true");
  window.location.href = `${FRONT_BASE_URL}/html/edit_pw.html`;
}
