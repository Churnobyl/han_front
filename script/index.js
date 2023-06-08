async function injectMainPage() {
  // 메인페이지 삽입
  for (let i = 1; i < 6; i++) {
    const navbarHtml = await fetch(`/html/randingPage/page${i}.html`);
    let data = await navbarHtml.text();
    document.querySelector(`div[data-anchor="page-${i}"]`).innerHTML = data;
  }
}

injectMainPage();

new Pageable("#scrollableContainer", {
  pips: true,
  animation: 800,
  delay: 500,
});

// document.querySelector(".nav").style.setProperty("background-color", null);
