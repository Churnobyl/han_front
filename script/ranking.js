import { getRankingApi } from "./api.js";

const token = localStorage.getItem("access");
const payload = token.split(".")[1];
const decodedPayload = JSON.parse(atob(payload));
const userId = decodedPayload["user_id"];

const leftArrow = document.getElementById("left-btn");
const rightArrow = document.getElementById("right-btn");

let rankingData;
let page = 0;

window.onload = function () {
  getRanking();
};

async function getRanking(link, e) {
  //   버튼을 통해 들어왔을 경우 & 아닐 경우
  if (!link) {
    rankingData = await getRankingApi();
  } else {
    if (e === "p") {
      page -= 10;
    } else if (e === "n") {
      page += 10;
    }
    rankingData = await getRankingApi(link);
  }

  //   받아온 데이터에서 previous, next 가 존재할 경우
  if (!rankingData["previous"]) {
    leftArrow.style.display = "none";
  } else {
    leftArrow.style.display = "block";
    leftArrow.onclick = function () {
      let link = rankingData["previous"];
      getRanking(link, "p");
    };
  }
  if (!rankingData["next"]) {
    rightArrow.style.display = "none";
  } else {
    rightArrow.style.display = "block";
    rightArrow.onclick = function () {
      let link = rankingData["next"];
      getRanking(link, "n");
    };
  }

  //   랭킹 순위 순서대로 띄워주기
  for (var i = 0; i <= 9; i++) {
    let parentElement = document.getElementById("rank-" + i);

    let rank = parentElement.querySelector(".rank");
    let user = parentElement.querySelector(".user");
    let levelXp = parentElement.querySelector(".level-xp");

    let result = rankingData["results"][i];
    if (result) {
      parentElement.style.display = "block";
      rank.innerText = page + i + 1;
      user.innerText = result["player"]["username"];
      levelXp.innerText = `${result["level"]} (${result["experiment"]})`;
      if (result["player"]["id"] == userId) {
        parentElement.style.backgroundColor = "wheat";
      } else {
        parentElement.style.backgroundColor = "white";
      }
    } else {
      parentElement.style.display = "none";
    }
  }
}
