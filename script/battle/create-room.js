import { makeRoomApi } from "/script/api.js";

const inputs = document.querySelectorAll("input");
for (let input of inputs) {
  input.addEventListener("keyup", (e) => {
    if (e.key === 13 || e.key === "Enter") {
      handleMakeRoom();
    }
  });
}

const toggle = document.querySelector(".toggleSwitch");

document
  .getElementById("btnCreateRoom")
  .addEventListener("click", handleMakeRoom);

function handleMakeRoom() {
  const titleInput = document.getElementById("title").value;
  const categoryInput = document.getElementById("category").value;
  const maxuserInput = document.getElementById("maxUser").value;
  let isPrivateInput = false;
  let roomPasswordInput = null;
  if (toggle.className.match("active") !== null) {
    isPrivateInput = true;
  }

  if (isPrivateInput) {
    if (document.getElementById("roomPassword").value !== "") {
      roomPasswordInput = document.getElementById("roomPassword").value;
    }
  }

  const roomData = {
    btl_title: titleInput,
    btl_category: categoryInput,
    max_users: maxuserInput,
    is_private: isPrivateInput,
    room_password: roomPasswordInput,
  };

  makeRoomApi(roomData).then(({ response, responseJson }) => {
    if (response.status === 201) {
      alert("새로운 방이 생성됐습니다");
      window.location.href = `/html/battle/battle-page.html?room=${responseJson}`;
    } else if (response.status === 500) {
      alert("이미 생성된 방이 있습니다");
    } else if (response.status === 400) {
      alert("선택되지 않은 옵션이 있는지 확인해주세요.");
    } else {
      alert("방 생성에 실패했습니다.");
    }
  });
}

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
  const passwordInput = document.getElementById("roomPassword");
  passwordInput.disabled = !passwordInput.disabled;
});
