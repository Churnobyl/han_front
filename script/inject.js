// 네이게이션 바 삽입
async function injectNavbar() {
  const navbarHtml = await fetch("/html/nav.html");
  let data = await navbarHtml.text();
  document.querySelector(".nav").innerHTML = data;
}

injectNavbar();

// 푸터 삽입
async function injectFooter() {
  const footerHtml = await fetch("/html/footer.html");
  let data = await footerHtml.text();
  document.querySelector(".footer").innerHTML = data;
}

injectFooter();
