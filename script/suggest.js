import { sendSuggestApi } from "./api.js";

// 버튼 클릭 시 함수 작동
document.getElementById("suggest-btn").addEventListener("click", handleSuggest);

function handleSuggest() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const explain = document.getElementById("explain").value;
  const crct = document.getElementById("crct").value;
  const wrong = document.getElementById("wrong").value;

  // 칸을 전부 안채웠을 때
  if (
    title === "" ||
    content === "" ||
    explain === "" ||
    crct === "" ||
    wrong === ""
  ) {
    alert("모든 칸을 채워주세요.");
    return;
  }

  console.log(title, content, explain, crct, wrong);

  const suggestData = {
    quiz: {
      title: title,
      content: content,
      explain: explain,
      difficulty: 1,
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
