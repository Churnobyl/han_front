document.getElementById("room-name-input").focus();
document.getElementById("room-name-input").onkeyup = function (e) {
  if (e.key === 13 || e.key === "Enter") {
    document.getElementById("room-name-input").click();
  }
};

document.getElementById("room-name-submit").onclick = function (e) {
  let roomName = document.getElementById("room-name-input").value;
  const queryParams = "?room=" + encodeURIComponent(roomName);
  const newURL = "/html/battle/battle-page.html" + queryParams;
  window.location.assign(newURL);
};
