let correctCount= JSON.parse(localStorage.getItem("correctCount"))

const quizResult = document.getElementById("quiz-result")
quizResult.innerText = `${correctCount}개 정답`

const xpBar = document.getElementById("xp-bar-now")
const xpText = document.getElementById("xp-text")
xpText.innerText = `${correctCount*10}xp 획득`