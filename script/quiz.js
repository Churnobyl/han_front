import { getQuizApi } from "./api.js";
import { sendQuizResultApi } from "./api.js";
import { sendQuizReportApi } from "./api.js";
import { FRONT_BASE_URL } from "./conf.js";

document.getElementById("answer-button").addEventListener("click", confirmQuiz);
document.getElementById("result-button").addEventListener("click", goResult);
document
  .getElementById("report-button")
  .addEventListener("click", reportModalOpen);
document
  .getElementById("report-submit-button")
  .addEventListener("click", reportSubmitBtn);
document.getElementById("back-arrow").addEventListener("click", function () {
  window.location.replace(`${FRONT_BASE_URL}/html/home.html`);
});
let modal = document.querySelector(".modal");
let quiz;
let quizzes;
let quizCounts;
let quizIndex = 0;
let correctCount = 0;

let quizzesOneOfTwo;
let quizzesMeaning;
let quizzesFillInTheBlank;
let quizzesCrossword;

let activeInput = null;
let activeLabel = null;
let activeCellId = null;

const xpBar = document.getElementById("xp-bar-now");
const xpText = document.getElementById("xp-text");

const answerBtn = document.getElementById("answer-button");
const resultBtn = document.getElementById("result-button");

// query문에 따라서 다른 퀴즈에 접속가능하게 하기
const urlParams = new URL(location.href).searchParams;
const quizType = urlParams.get("type");

async function getQuiz() {
  if (!quizType) {
    quizzes = await getQuizApi();
  } else {
    quizzes = await getQuizApi(quizType);
  }

  quizCounts = quizzes["counts"];
  quizzesOneOfTwo = quizzes["one_of_two"] || [];
  quizzesMeaning = quizzes["meaning"] || [];
  quizzesFillInTheBlank = quizzes["fill_in_the_blank"] || [];
  quizzesCrossword = quizzes["crossword_puzzle"] || undefined;
  if (quizzesCrossword !== undefined) {
    quizzesCrossword = await JSON.parse(quizzesCrossword);
    quizzes = [
      ...quizzesOneOfTwo,
      ...quizzesMeaning,
      ...quizzesFillInTheBlank,
      quizzesCrossword,
    ];
  } else {
    quizzes = [...quizzesOneOfTwo, ...quizzesMeaning, ...quizzesFillInTheBlank];
  }
  const sumQuiz = quizCounts.reduce((a, b) => a + b);

  xpBar.setAttribute("style", `width: calc(9.9% * ${quizIndex})`);
  xpText.innerText = `${quizIndex} / ${sumQuiz}`;
}

function showQuiz() {
  if (quizIndex < quizCounts[0]) {
    OneOfTwo();
  } else if (quizIndex < quizCounts[0] + quizCounts[1]) {
    Meaning();
  } else if (quizIndex < quizCounts[0] + quizCounts[1] + quizCounts[2]) {
    FillInTheBlank();
  } else if (
    quizIndex <
    quizCounts[0] + quizCounts[1] + quizCounts[2] + quizCounts[3]
  ) {
    Crossword();
  }
}

function OneOfTwo() {
  quiz = quizzes[quizIndex];

  const quizCategory = document.getElementById("quiz-category");
  const quizTitle = document.getElementById("quiz-title");
  quizCategory.innerHTML = "알쏭달쏭 우리말 퀴즈";
  quizTitle.innerHTML = `<h1>${quiz.title}</h1>`;

  const quizContent = document.getElementById("quiz-content");
  quizContent.innerHTML = "";

  for (let i = 0; i < quiz.options.length; i++) {
    let optionDiv = document.createElement("div");
    optionDiv.setAttribute("class", "quiz");

    let optionH2 = document.createElement("h2");
    optionH2.setAttribute("id", i);
    optionH2.innerText = quiz.options[i].content;
    optionH2.addEventListener("click", selectOption);
    optionDiv.append(optionH2);

    quizContent.append(optionDiv);
  }
}

function Meaning() {
  quiz = quizzes[quizIndex];

  const quizCategory = document.getElementById("quiz-category");
  const quizTitle = document.getElementById("quiz-title");
  quizCategory.innerHTML = "단어 맞추기";
  quiz.explains.forEach((explain) => {
    quizTitle.innerHTML = `<h1>${explain.content}</h1>`;
  });

  const quizContent = document.getElementById("quiz-content");
  quizContent.innerHTML = "";

  for (let i = 0; i < quiz.words_list.length; i++) {
    let optionDiv = document.createElement("div");
    optionDiv.setAttribute("class", "quiz");

    let optionH2 = document.createElement("h2");
    optionH2.setAttribute("id", i);
    optionH2.innerText = quiz.words_list[i];
    optionH2.addEventListener("click", selectOption);
    optionDiv.append(optionH2);
    quizContent.append(optionDiv);
  }
}

function FillInTheBlank() {
  quiz = quizzes[quizIndex];

  const quizCategory = document.getElementById("quiz-category");
  const quizTitle = document.getElementById("quiz-title");
  quizCategory.innerHTML = "빈칸 채우기";
  quizTitle.innerHTML = `<h1>${quiz.content}</h1>`;

  const quizContent = document.getElementById("quiz-content");
  quizContent.innerHTML = "";
  quiz.dict_word.examples.forEach((example) => {
    quizContent.innerHTML += `<h3>${example}</h3>`;
  });
  quizContent.innerHTML += `
  <input id="inputBox" type="text" placeholder="답안 입력"></input>`;
  document.getElementById("inputBox").focus();
}

class CrosswordMaker {
  // 십자말퍼즐 생성기
  constructor(quiz, table, horizontalExplanations, verticalExplanations) {
    this.quiz = quiz;
    this.table = table;
    this.horizontalExplanations = horizontalExplanations;
    this.verticalExplanations = verticalExplanations;

    this.activeCellId = null;
    this.cellNumberCounts = {};
    this.wordInput = document.getElementById("wordInput");
    this.wordLabel = document.getElementById("wordLabel");
    this.cells = {};
    this.activeCells = [];
    this.nowOrientation;
    this.nowNum;
    this.activeExplanationId = null;
    this.checkAnswerButton = document.getElementById("checkAnswer");
    this.preparePuzzle();
    this.populateCells();
    this.checkAnswer();
    this.removeKoreanCharacters();
  }

  preparePuzzle() {
    // 퍼즐 데이터 정렬
    this.data = this.quiz.problems;
    this.problemData = this.quiz.problem_data.sort((a, b) => {
      return (
        a.position[0] * 10 +
        a.position[1] -
        (b.position[0] * 10 + b.position[1])
      );
    });
  }

  populateCells() {
    // 퍼즐 데이터 길이만큼 셀 생성하기
    for (let i = 0; i < this.data.length; i++) {
      let row = this.table.insertRow();
      for (let j = 0; j < this.data[i].length; j++) {
        let cell = row.insertCell();
        cell.id = `cell-${i}-${j}`;
        this.prepareCell(cell, i, j);
      }
    }
  }

  prepareCell(cell, i, j) {
    // 셀에 정보 담기
    let cellText = this.data[i][j] !== " " ? this.data[i][j] : "";
    cell.innerHTML = cellText;
    if (cellText === "") {
      cell.classList.add("emptyCell");
    } else {
      cell.classList.add("hidden");
    }

    for (let k = 0; k < this.problemData.length; k++) {
      let wordPosition = this.problemData[k].position;
      let wordLength = this.problemData[k].word.length;

      if (
        (this.problemData[k].orientation === "right" &&
          wordPosition[0] === i &&
          wordPosition[1] <= j &&
          j < wordPosition[1] + wordLength) ||
        (this.problemData[k].orientation === "bottom" &&
          wordPosition[1] === j &&
          wordPosition[0] <= i &&
          i < wordPosition[0] + wordLength)
      ) {
        if (!this.cells[`${i}-${j}`]) {
          this.cells[`${i}-${j}`] = [];
        }
        this.cells[`${i}-${j}`].push({
          index: k,
          start: wordPosition,
          orientation: this.problemData[k].orientation,
          length: wordLength,
          explanation: this.problemData[k].explain,
        });

        if (wordPosition[0] === i && wordPosition[1] === j) {
          let numberElement = document.createElement("div");
          numberElement.textContent = (k + 1).toString();
          numberElement.classList.add("word-number");
          numberElement.style.top =
            (this.cellNumberCounts[`${i},${j}`] || 0) * 1.2 + "em";
          cell.appendChild(numberElement);
          this.cellNumberCounts[`${i},${j}`] =
            (this.cellNumberCounts[`${i},${j}`] || 0) + 1;

          let listItem = document.createElement("li");
          listItem.textContent =
            k + 1 + ". " + this.problemData[k].explain.slice(0, 3);
          listItem.id = "explanation-" + (k + 1);
          if (this.problemData[k].orientation === "right") {
            this.horizontalExplanations.appendChild(listItem);
          } else {
            this.verticalExplanations.appendChild(listItem);
          }
        }

        cell.clickListeners = [];

        // this.handleCellClick(cell, i, j, k, wordPosition, wordLength);
        if (this.cells[`${i}-${j}`]) {
          this.cells[`${i}-${j}`].forEach((wordInfo) => {
            this.handleCellClick(
              cell,
              i,
              j,
              wordInfo.index,
              wordInfo.start,
              wordInfo.length
            );
          });
        }

        cell.addEventListener("click", () => {
          let listener = cell.clickListeners.shift();
          if (listener) {
            listener();
            cell.clickListeners.push(listener);
          }
        });
      }
    }
  }

  handleCellClick(cell, i, j, k, wordPosition, wordLength) {
    // 셀 클릭했을 때 동작하는 핸들러
    let hintButton = document.getElementById("giveHint");
    let hintBox = document.querySelector(".hint-box");
    let orientation = this.problemData[k].orientation;
    let highlightClass =
      orientation === "right" ? "highlightRight" : "highlightBottom";

    let highlightStayClass =
      orientation === "right" ? "highlightStayRight" : "highlightStayBottom";

    let highlightExplainClass =
      orientation === "right"
        ? "highlightExplainHorizontal"
        : "highlightExplainVertical";

    let highlightExplainStayClass =
      orientation === "right"
        ? "highlightExplainStayHorizontal"
        : "highlightExplainStayVertical";

    cell.addEventListener("mouseover", () => {
      for (let l = 0; l < wordLength; l++) {
        let highlightCell =
          orientation === "right"
            ? this.table.rows[i].cells[wordPosition[1] + l]
            : this.table.rows[wordPosition[0] + l].cells[j];
        highlightCell.classList.add(highlightClass);
      }
      document
        .getElementById("explanation-" + (k + 1))
        .classList.add(highlightExplainClass);
    });

    cell.addEventListener("mouseout", () => {
      for (let l = 0; l < wordLength; l++) {
        let highlightCell =
          orientation === "right"
            ? this.table.rows[i].cells[wordPosition[1] + l]
            : this.table.rows[wordPosition[0] + l].cells[j];
        highlightCell.classList.remove(highlightClass);
      }
      document
        .getElementById("explanation-" + (k + 1))
        .classList.remove(highlightExplainClass);
    });

    cell.clickListeners.push(() => {
      if (this.activeExplanationId) {
        document
          .getElementById(this.activeExplanationId)
          .classList.remove(
            "highlightExplainStayHorizontal",
            "highlightExplainStayVertical"
          );
        this.activeExplanationId = null;
      }

      for (let l = 0; l < this.activeCells.length; l++) {
        this.activeCells[l].classList.remove(
          "highlightStayRight",
          "highlightStayBottom"
        );
      }

      hintBox.textContent = "";

      this.activeCells = [];

      if (this.activeCellId !== cell.id) {
        this.wordLabel.textContent =
          (orientation === "right" ? "가로 " : "세로 ") + (k + 1) + "번";

        this.nowOrientation = orientation;
        this.nowNum = k + 1;

        this.wordInput.value = "";
        this.wordInput.dataset.cells =
          orientation === "right"
            ? Array.from(
                { length: wordLength },
                (_, l) => `cell-${i}-${wordPosition[1] + l}`
              )
            : Array.from(
                { length: wordLength },
                (_, l) => `cell-${wordPosition[0] + l}-${j}`
              );

        this.activeCellId = cell.id;

        for (let l = 0; l < wordLength; l++) {
          let highlightCell =
            orientation === "right"
              ? this.table.rows[i].cells[wordPosition[1] + l]
              : this.table.rows[wordPosition[0] + l].cells[j];
          highlightCell.classList.add(highlightStayClass);
          this.activeCells.push(highlightCell);
        }

        let explanationElement = document.getElementById(
          "explanation-" + (k + 1)
        );
        explanationElement.classList.add(highlightExplainStayClass);
        this.activeExplanationId = explanationElement.id;
      } else {
        this.wordLabel.textContent = "";
        this.wordInput.value = "";
        this.wordInput.dataset.cells = "";
        this.activeCellId = null;

        for (let l = 0; l < wordLength; l++) {
          let highlightCell =
            orientation === "right"
              ? this.table.rows[i].cells[wordPosition[1] + l]
              : this.table.rows[wordPosition[0] + l].cells[j];
          highlightCell.classList.remove(highlightStayClass);
        }
        document
          .getElementById("explanation-" + (k + 1))
          .classList.remove(highlightExplainStayClass);
      }

      hintButton.addEventListener("click", () => {
        let hint = this.problemData[k].hint;
        hintBox.textContent = hint;
      });
    });

    cell.clickListeners = cell.clickListeners.filter(
      (listener) => listener !== this
    );
  }

  checkAnswer() {
    // 엔터나 확인 버튼 클릭했을 때 checkAnswerEach 동작
    const input = document.getElementById("word-input");
    input.addEventListener("keyup", (e) => {
      if (e.key === 13 || e.key === "Enter") {
        this.checkAnswerEach();
      }
    });
    this.checkAnswerButton.addEventListener("click", () =>
      this.checkAnswerEach()
    );
  }

  checkAllAnswers() {
    // 모든 셀 가져오기
    let allCells = document.getElementsByTagName("td");

    // 모든 셀 검사
    for (let cell of allCells) {
      if (
        !cell.classList.contains("emptyCell") &&
        cell.classList.contains("hidden")
      ) {
        return false;
      }
    }
    return true;
  }

  checkAnswerEach() {
    // 현재 선택된 단어의 정보 가져오기
    let cells = this.wordInput.dataset.cells.split(",");
    let userInput = this.wordInput.value;

    // this.quiz에서 해당 단어의 정보 찾기
    let wordInfo = this.quiz.problem_data[this.nowNum - 1];

    // 사용자 입력이 정답과 일치하는지 확인
    if (userInput === wordInfo.word) {
      // 정답이면 각 셀에 표시
      cells.forEach((cellId, index) => {
        let cell = document.getElementById(cellId);
        if (
          cell &&
          !Array.from(cell.childNodes).some(
            (node) => node.nodeType === Node.TEXT_NODE
          )
        ) {
          let textNode = document.createTextNode(wordInfo.word[index]);
          cell.appendChild(textNode);
          cell.classList.remove("hidden");
        }
      });
    } else {
      alert("틀렸습니다.");
    }

    if (this.checkAllAnswers()) {
      alert("축하합니다! 퍼즐을 완성했습니다!");
    }
  }

  removeKoreanCharacters() {
    // 답안 숨기기
    const hiddenCells = document.querySelectorAll(".hidden");
    let koreanRegex = /[\uAC00-\uD7A3]/g;

    hiddenCells.forEach((cell) => {
      let originalHTML = cell.innerHTML;
      let newHTML = originalHTML.replace(koreanRegex, "");

      // 셀의 HTML을 새 HTML로 변경
      cell.innerHTML = newHTML;
    });
  }
}

function Crossword() {
  const quizCategory = document.getElementById("quiz-category");
  quizCategory.innerHTML = "십자말퍼즐";
  fetch("/html/quiz/quiz-category/crossword.html")
    .then((response) => {
      return response.text();
    })
    .then((responseText) => {
      const quizBase = document.querySelector(".quiz-base");
      quizBase.innerHTML = responseText;
    })
    .then(() => {
      quiz = quizzes[quizIndex];
      let table = document.getElementById("crossword");
      let horizontalExplanations = document.getElementById(
        "horizontalExplanations"
      );
      let verticalExplanations = document.getElementById(
        "verticalExplanations"
      );

      new CrosswordMaker(
        quiz,
        table,
        horizontalExplanations,
        verticalExplanations
      );
    });
}

function selectOption(e) {
  const options = document.querySelectorAll("h2");
  options.forEach((option) => {
    option.classList.remove("selected");
  });
  e.target.classList.add("selected");
}

function confirmQuiz() {
  quiz = quizzes[quizIndex];

  if (quizIndex < quizCounts[0]) {
    const options = document.getElementsByClassName("selected");
    if (options.length == 0) {
      alert("❗ 정답을 골라주세요");
      return;
    }
    if (quiz.options[options[0].id].is_answer) {
      alert("✅ 정답입니다" + "\n\n해설:" + quiz.explain);
      correctCount++;
      quiz["solved"] = true;
    } else {
      alert("🚫 오답입니다" + "\n\n해설:" + quiz.explain);
      quiz["solved"] = false;
    }
  } else if (quizIndex < quizCounts[0] + quizCounts[1]) {
    const options = document.getElementsByClassName("selected");
    if (options.length == 0) {
      alert("정답을 골라주세요");
      return;
    }
    if (quiz.answer_index == options[0].id) {
      alert("✅ 정답입니다");
      correctCount++;
      quiz["solved"] = true;
    } else {
      alert("🚫 오답입니다" + `\n\n정답은" ${quiz.word} 입니다`);
      quiz["solved"] = false;
    }
  } else if (quizIndex < quizCounts[0] + quizCounts[1] + quizCounts[2]) {
    const inputWord = document.getElementById("inputBox").value;
    if (inputWord == false) {
      alert("정답을 적어주세요");
      return;
    }
    if (quiz.dict_word.word == inputWord) {
      alert("✅ 정답입니다");
      correctCount++;
      quiz["solved"] = true;
    } else {
      alert("🚫 오답입니다" + `\n\n정답은 ${quiz.dict_word.word} 입니다`);
      quiz["solved"] = false;
    }
  }
  nextStep();
}

function nextStep() {
  quizIndex++;

  const xpBar = document.getElementById("xp-bar-now");
  const xpText = document.getElementById("xp-text");

  xpBar.setAttribute("style", `width: calc(9.9% * ${quizIndex})`);
  xpText.innerText = `${quizIndex} / 10`;

  if (quizIndex == quizzes.length) {
    answerBtn.style.display = "none";
    resultBtn.style.display = "block";

    finishQuiz();
  } else {
    showQuiz();
    const inputBoxTag = document.getElementById("inputBox")
      ? document.getElementById("inputBox")
      : null;

    console.log(inputBoxTag);

    if (inputBoxTag !== null) {
      inputBoxTag.addEventListener("keyup", (e) => {
        if (e.key === 13 || e.key === "Enter") {
          confirmQuiz();
        }
      });
    }
  }
}

async function finishQuiz() {
  await sendQuizResultApi(quizzes);
  localStorage.setItem("correctCount", correctCount);
}

function goResult() {
  window.location.replace("/html/quiz_result.html");
}

function reportModalOpen() {
  modal.classList.toggle("show");
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.toggle("show");
  }
});

async function reportSubmitBtn() {
  const content = document.getElementById("report-content");
  const type = document.getElementById("quiz-category").textContent;

  const reportData = {
    content: content.value,
    quiz_type: type,
    quiz_content: quiz,
  };

  const response = await sendQuizReportApi(reportData);
  alert(response.message);
  content.value = "";
}

window.onload = async function () {
  getQuiz().then(() => {
    showQuiz();
  });
  resultBtn.style.display = "none";
  localStorage.removeItem("correctCount");
};
