document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("loginID").value.trim();
  const password = document.getElementById("loginPassword").value;

  // 입력값 확인
  if (!id || !password) {
    displayAlert("아이디와 비밀번호를 확인해주세요.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      window.location.href = "/MainPage/MainPage.html";
    } else {
      displayAlert(result.message); // 서버 응답 메시지 표시
    }
  } catch (error) {
    displayAlert("서버 오류 발생. 다시 시도해주세요.");
  }
});

/**
 * 메시지 창 표시 함수
 * @param {string} message - 사용자에게 표시할 메시지
 */
function displayAlert(message) {
  const existingAlert = document.querySelector(".alert-box");
  if (existingAlert) existingAlert.remove();

  const alertBox = document.createElement("div");
  alertBox.className = "alert-box";
  alertBox.textContent = message;

  const closeButton = document.createElement("span");
  closeButton.className = "alert-close";
  closeButton.textContent = "×";
  closeButton.onclick = () => alertBox.remove();

  alertBox.appendChild(closeButton);
  document.body.appendChild(alertBox);

  setTimeout(() => {
    if (alertBox) alertBox.remove();
  }, 5000);
}
