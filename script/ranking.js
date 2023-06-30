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

document.getElementById("battle-rank").addEventListener("click", function () {
  getRanking(null, null, (query = "?type=battle"));
});
document.getElementById("exp-rank").addEventListener("click", function () {
  getRanking();
});

window.onload = function () {
  getRanking();
};

async function getRanking(link, e, query) {
  // 호출 중일 경우에 추가로 호출 못하게
  if (isFetching) {
    return;
  }
  isFetching = true;

  //   버튼을 통해 들어왔을 경우 & 아닐 경우
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
  const idxWrap = document.querySelector(".idx-wrap");

  //   받아온 데이터에서 previous, next 가 존재할 경우
  if (!rankingData["links"]["previous"]) {
    leftArrow.style.display = "none";
  } else {
    leftArrow.style.display = "block";
    leftArrow.onclick = function () {
      let link = rankingData["links"]["previous"];
      getRanking(link, "p");
    };
  }
  if (!rankingData["links"]["next"]) {
    rightArrow.style.display = "none";
  } else {
    rightArrow.style.display = "block";
    rightArrow.onclick = function () {
      let link = rankingData["links"]["next"];
      getRanking(link, "n");
    };
  }
  ranks.forEach((rank) => {
    rank.style = "display: block;";
  });
  //   랭킹 순위 순서대로 띄워주기
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
  // 호출 끝나고 다 보여준 뒤에 false로 바꿈
  isFetching = false;
}
