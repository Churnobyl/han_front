import { getQuizApi } from "./api.js";
import { sendQuizResultApi } from "./api.js";

document.getElementById("answer-button").addEventListener("click", confirmQuiz)
document.getElementById("result-button").addEventListener("click", goResult)

let quizzes
let quizIndex=0
let correctCount=0

async function getQuiz(){
  quizzes = await getQuizApi()
}

async function showQuiz(){
  const quiz = quizzes[quizIndex]

  const quizCategory = document.getElementById("quiz-category")
  const quizTitle = document.getElementById("quiz-title")
  quizCategory.innerHTML = quiz.title+quiz.id
  quizTitle.innerHTML = quiz.content

  const quizOptions = document.getElementById("quiz-options")
  quizOptions.innerHTML = ""

  for (let i=0; i < quiz.options.length; i++){
    let optionDiv = document.createElement("div")
    optionDiv.setAttribute("class", "quiz")

    let optionH2 = document.createElement("h2")
    optionH2.setAttribute("id", i)
    optionH2.innerText = quiz.options[i].content
    optionH2.addEventListener("click", selectOption)
    optionDiv.append(optionH2)
    
    quizOptions.append(optionDiv)
  }
}

function selectOption(e){
  const options = document.querySelectorAll("h2")
  options.forEach(option => {
    option.classList.remove("selected")
  });
  e.target.classList.add("selected")
}

function confirmQuiz(){
  const quiz = quizzes[quizIndex]
  const options = document.getElementsByClassName("selected")
  if (options.length==0) {
    alert("정답을 골라주세요")
    return
  }
  if (quiz.options[options[0].id].is_answer) {
    alert("정답입니다"+"\n해설:"+quiz.explain)
    correctCount++
    quiz["solved"] = true
  } else {
    alert("오답입니다"+"\n해설:"+quiz.explain)
    quiz["solved"] = false
  }
  nextStep()
}

function nextStep(){
  const options = document.querySelectorAll("h2")
  options.forEach(option => {
    option.classList.remove("selected")
  });

  quizIndex++

  const xpBar = document.getElementById("xp-bar-now")
  const xpText = document.getElementById("xp-text")
  xpBar.setAttribute("style", `width: calc(9.9% * ${quizIndex})`)
  xpText.innerText = (`${quizIndex} / 10`)

  if (quizIndex==quizzes.length){
    finishQuiz()
  } else {
    showQuiz()
  }
}

async function finishQuiz(){
  await sendQuizResultApi(quizzes)
  localStorage.setItem("correctCount", correctCount);
}

function goResult() {
  window.location.href = "/html/quiz_result.html";
}

window.onload = async function(){
  await getQuiz();
  await showQuiz();
}