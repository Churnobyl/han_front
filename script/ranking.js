import { getRankingApi, checkAnonymous } from "./api.js";
import { FRONT_BASE_URL } from "./conf.js";

checkAnonymous();

const token = localStorage.getItem("access");
let userId;
if (token) {
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  userId = decodedPayload["user_id"];
}

let rankingData;
let page = 0;
let isFetching;
let query;

window.onload = function () {
  getRanking().then(addButtons);
  document.getElementById("battle-rank").addEventListener("click", function () {
    page = 0;
    getRanking(null, null, (query = "?type=battle")).then(addButtons);
  });
  
  document.getElementById("exp-rank").addEventListener("click", function () {
    page = 0;
    getRanking().then(addButtons);
  });
  
};

async function getRanking(link, e, query) {
  if (isFetching) {
    return;
  }
  isFetching = true;

  if (!link) {
    if (!query) {
      rankingData = await getRankingApi();
    } else {
      rankingData = await getRankingApi(null, query);
    }
  } else {
    rankingData = await getRankingApi(link);
    if (e === "p") {
      page -= 10;
    } else if (e === "n") {
      page += 10;
    }
  }

  const leftArrow = document.getElementById("left-btn");
  const rightArrow = document.getElementById("right-btn");
  const ranks = document.querySelectorAll(".user-wrap");

  if (!rankingData["links"]["previous"]) {
    leftArrow.style.display = "none";
  } else {
    leftArrow.style.display = "block";
    leftArrow.onclick = function () {
      let link = rankingData["links"]["previous"];
      getRanking(link, "p").then(addButtons);
    };
  }
  if (!rankingData["links"]["next"]) {
    rightArrow.style.display = "none";
  } else {
    rightArrow.style.display = "block";
    rightArrow.onclick = function () {
      let link = rankingData["links"]["next"];
      getRanking(link, "n").then(addButtons);
    };
  }
  ranks.forEach((rank) => {
    rank.style = "display: block;";
  });
  for (var i = 0; i <= 9; i++) {
    let parentElement = document.getElementById("rank-" + i);

    let rank = parentElement.querySelector(".rank");
    let user = parentElement.querySelector(".user");
    let levelXp = parentElement.querySelector(".level-xp");
    let battle = parentElement.querySelector(".battle");

    let result = rankingData["results"][i];
    if (result) {
      parentElement.style.display = "block";
      rank.innerText = page + i + 1;
      user.innerText = result["player"]["username"];
      user.addEventListener("click", function () {
        window.location.href = `${FRONT_BASE_URL}/html/mypage.html?id=${result["player"]["id"]}`;
      });
      levelXp.innerText = `${result["level"]} (${result["experiment"]})`;
      battle.innerText = result["battlepoint"];
      if (result["player"]["id"] == userId) {
        parentElement.style.backgroundColor = "wheat";
      } else {
        parentElement.style.backgroundColor = "white";
      }
    } else {
      parentElement.style.display = "none";
    }
  }
  isFetching = false;
}

function addButtons() {
  const leftArrow = document.getElementById("left-btn");
  const rightArrow = document.getElementById("right-btn");

  if (!leftArrow.onclick && !rightArrow.onclick) {
    leftArrow.style.display = "none";
    leftArrow.onclick = function () {
      let link = rankingData["links"]["previous"];
      getRanking(link, "p").then(addButtons);
    };

    rightArrow.style.display = "none";
    rightArrow.onclick = function () {
      let link = rankingData["links"]["next"];
      getRanking(link, "n").then(addButtons);
    };
  }
}
