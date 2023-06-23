import { sendSuggestApi, checkAnonymous } from "./api.js";

checkAnonymous();

// 엔터 시 함수 작동
const inputs = document.querySelectorAll("input");
for (let input of inputs) {
  input.addEventListener("keyup", (e) => {
    if (e.key === 13 || e.key === "Enter") {
      handleSuggest();
    }
  });
}

// 버튼 클릭 시 함수 작동
document.getElementById("suggest-btn").addEventListener("click", handleSuggest);

function handleSuggest() {
  const title = document.getElementById("title").value;
  const explain = document.getElementById("explain").value;
  const crct = document.getElementById("crct").value;
  const wrong = document.getElementById("wrong").value;

  // 칸을 전부 안채웠을 때
  if (
    title === "" ||
    explain === "" ||
    crct === "" ||
    wrong === ""
  ) {
    alert("모든 칸을 채워주세요.");
    return;
  }

  const suggestData = {
    quiz: {
      title: title,
      explain: explain,
      is_pass: false,
    },
    options: [
      {
        content: crct,
        is_answer: true,
      },
      {
        content: wrong,
        is_answer: false,
      },
    ],
  };

  sendSuggestApi(suggestData);
}
