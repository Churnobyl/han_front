import { getRoomApi } from "/script/api.js";

window.onload = () => {
  // 방 정보 가져오기
  getRoomApi()
    .then((response) => {
      const roomData = response.responseJson;

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
      }
    })
    .then(handleRoomClick);
};

function handleRoomClick() {
  const roomNumbers = document.querySelectorAll("[data-roomId");
  for (let number of roomNumbers) {
    const roomNum = number.getAttribute("data-roomId");
    number.addEventListener("click", () => {
      window.location.href = `/html/battle/battle-page.html?room=${roomNum}`;
    });
  }
}
