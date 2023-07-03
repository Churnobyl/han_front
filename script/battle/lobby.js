import { getRoomApi, checkAnonymous, socket } from "/script/api.js";

checkAnonymous();

socket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  if (data.method === "lobby_room_add" || data.method === "lobby_room_delete") {
    document.getElementById("room-data").innerHTML = "";
    for (let d of data.message) {
      const check_private = d.is_private ? '<img src="/img/private.png">' : "";
      document.getElementById(
        "room-data"
      ).innerHTML += `<tr data-roomId=${d.id}>
                    <td class="tg-0lax">${d.id}</td>
                    <td class="tg-0lax">${d.btl_title} ${check_private}</span></td>
                    <td class="tg-0lax">${d.btl_category}</td>
                    <td class="tg-0lax">1 / ${d.max_users}</td>
                    <td class="tg-0lax">${d.host_user}</td>
                  </tr>`;
    }
  } else if (data.method === "lobby_room_updated") {
    document.getElementById("room-data").innerHTML = "";
    for (let d of data.message) {
      // 추후에 업데이트 시 일부 요소만 바꾸는 식으로 수정해야 함
      const check_private = d.is_private ? '<img src="/img/private.png">' : "";
      document.getElementById(
        "room-data"
      ).innerHTML += `<tr data-roomId=${d.id}>
                    <td class="tg-0lax">${d.id}</td>
                    <td class="tg-0lax">${d.btl_title} ${check_private}</span></td>
                    <td class="tg-0lax">${d.btl_category}</td>
                    <td class="tg-0lax">${d.participants} / ${d.max_users}</td>
                    <td class="tg-0lax">${d.host_user}</td>
                  </tr>`;

      if (d.btl_start === true) {
        const updated_room = document.querySelector(`[data-roomid="${d.id}"]`);
        updated_room.classList.add("started-game");
      }
    }
  }

  handleRoomClick(data.message);
};

window.onload = () => {
  // 방 정보 가져오기
  getRoomApi()
    .then(({ response, responseJson }) => {
      const roomData = responseJson;
      if (response.status === 200) {
        for (let data of roomData) {
          const check_private = data.is_private
            ? '<img src="/img/private.png">'
            : "";
          document.getElementById(
            "room-data"
          ).innerHTML += `<tr data-roomId=${data.id}>
                        <td class="tg-0lax">${data.id}</td>
                        <td class="tg-0lax">${data.btl_title} ${check_private}</span></td>
                        <td class="tg-0lax">${data.btl_category}</td>
                        <td class="tg-0lax">${data.participants} / ${data.max_users}</td>
                        <td class="tg-0lax">${data.host_user}</td>
                      </tr>`;

          if (data.btl_start === true) {
            const updated_room = document.querySelector(
              `[data-roomid="${data.id}"]`
            );
            updated_room.classList.add("started-game");
          }
        }
      } else {
        console.error(responseJson);
      }

      return responseJson;
    })
    .then((data) => {
      handleRoomClick(data);
    })
    .then(() => {
      document
        .getElementById("writeButton")
        .addEventListener(
          "click",
          () => (window.location.href = "/html/battle/create-room.html")
        );
    });
};

function handleRoomClick(data) {
  const roomNumbers = document.querySelectorAll("[data-roomId]");
  for (let number of roomNumbers) {
    const roomNum = number.getAttribute("data-roomId");

    number.addEventListener("click", () => {
      checkPossibleRoom(data, roomNum);
    });
  }
}

function checkPossibleRoom(data, roomNum) {
  // 참가 가능한 방인지 체크
  for (let d of data) {
    if (String(d.id) === roomNum) {
      if (d.btl_start) {
        alert("이미 시작한 방입니다.");
      } else if (d.max_users > d.participants) {
        if (d.is_private) {
          handlePasswordModal(roomNum, d.room_password);
        } else {
          enterTheRoom(roomNum);
        }
      } else {
        alert("최대 인원 수를 초과했습니다.");
      }
    }
  }
}

function handlePasswordModal(roomNum, password) {
  // 비공개방 비밀번호 누르는 모달창 열기
  modal.style.display = "block";
  const inputPassword = document.getElementById("checkPassword");
  const btnPassword = document.getElementById("submit-modal");

  inputPassword.focus();

  inputPassword.addEventListener("keyup", (e) => {
    if (e.key === 13 || e.key === "Enter") {
      if (Number(inputPassword.value) === password) {
        enterTheRoom(roomNum);
      } else if (inputPassword.value.length > 8) {
        alert("비밀번호는 8자 이내입니다.");
      } else {
        alert("비밀번호가 틀렸습니다");
      }
    }
  });

  btnPassword.addEventListener("click", () => {
    // 비공개방 체크
    if (Number(inputPassword.value) === password) {
      enterTheRoom(roomNum);
    } else if (inputPassword.value.length > 8) {
      alert("비밀번호는 8자 이내입니다.");
    } else {
      alert("비밀번호가 틀렸습니다");
    }
  });
}

function enterTheRoom(roomNum) {
  window.location.href = `/html/battle/battle-page.html?room=${roomNum}`;
}

const modal = document.getElementById("modal");
// const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.getElementById("close-modal");

// 모달창 닫기
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // 스크롤바 보이기
});
