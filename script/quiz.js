import { getQuizApi } from "./api.js";

const answerButton = document.getElementById("answer-button")
answerButton.addEventListener("click", confirmQuiz)

let quizzes
let quizIndex=0

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
  } else {
    alert("오답입니다"+"\n해설:"+quiz.explain)
  }
  nextStep()
}

function nextStep(){
  const options = document.querySelectorAll("h2")
  options.forEach(option => {
    option.classList.remove("selected")
  });

  quizIndex++
  if (quizIndex==quizzes.length){
    finishQuiz()
  }
  showQuiz()
}

function finishQuiz(){
  alert("다풀었습니다. 결과화면으로 넘어가기")
}

window.onload = async function(){
  await getQuiz();
  await showQuiz();
}