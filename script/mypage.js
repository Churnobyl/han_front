import { FRONT_BASE_URL, BACK_BASE_URL } from "./conf.js";

window.onload = async function loadProfile() {
    const urlParams = new URL(location.href).searchParams;
    const userId = urlParams.get('id');
    const response = await fetch(`${BACK_BASE_URL}/users/${userId}/`, {
        method: "GET",
    });
    const responseJson = await response.json();
    console.log(responseJson);

    // 프로필 보여주기
    document.getElementById("userEmail").innerText = `이메일 : ${responseJson["유저"]["email"]}`;
    document.getElementById("userName").innerText = `별명 : ${responseJson["유저"]["username"]}`;
    document.getElementById("userLevel").innerText = `레벨 ${responseJson["유저"]["level"]} (${responseJson["유저"]["experiment"]}/${responseJson["유저"]["max_experiment"]})`;

    const expProgress = document.getElementById("exp");
    expProgress.setAttribute("max", responseJson["유저"]["max_experiment"]);
    expProgress.setAttribute("value", responseJson["유저"]["experiment"]);

    //착용 칭호 보여주기
    const wearAchieve = document.getElementById("wearAchieve")
    if (responseJson["칭호"]==="null") {
        wearAchieve.innerText = "착용 칭호가 없습니다.";
    } else {
        wearAchieve.innerText = responseJson["칭호"]["title"];
    };

    //칭호 보여주기
    const userAchievement = document.getElementById("userAchievement");
    responseJson["유저"]["achieve"].forEach(achieve => {
        const achieveDiv = document.createElement("div");
        achieveDiv.setAttribute("class", "achievement");
        const achieveTitle = document.createElement("p");
        achieveTitle.setAttribute("class", "achieve-title");
        achieveTitle.innerText = achieve["title"];
        const achieveContent = document.createElement("p");
        achieveContent.innerText = achieve["comment"];
        achieveDiv.appendChild(achieveTitle);
        achieveDiv.appendChild(achieveContent);
        userAchievement.appendChild(achieveDiv);
    });
}

document.getElementById("profileEditBtn").addEventListener("click", handleEditPage);

function handleEditPage() {
    const urlParams = new URL(location.href).searchParams;
    const userId = urlParams.get('id');
    window.location.href = `${FRONT_BASE_URL}/html/edit_page.html?id=${userId}`
}