// index.js - Main script for index.html

document.addEventListener("DOMContentLoaded", () => {
  // Example functionality: Log to console when page is loaded
  console.log("Index page loaded");

  // Fetch session data to determine if the user is logged in
  fetch("/session")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Unauthorized");
      }
    })
    .then((data) => {
      // Display user info if session exists
      document.getElementById("user-info").style.display = "flex";
      document.getElementById("user-name").textContent = data.user.id + "님";
    })
    .catch(() => {
      // Hide user info if not logged in
      document.getElementById("user-info").style.display = "none";
    });

  // Handle logout functionality
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      fetch("/logout", { method: "POST" })
        .then(() => {
          window.location.href = "MainLogin.html";
        })
        .catch(() => alert("로그아웃 실패"));
    });
  }
});
