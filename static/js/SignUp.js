document.getElementById("signupForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("signupID").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/SignUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      window.location.href = "MainLogin.html";
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert("서버 오류 발생. 다시 시도해주세요.");
  }
});
