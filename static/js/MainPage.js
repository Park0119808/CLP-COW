// 소 데이터 정의
const cowData = [
  { id: 1, name: "소1", isInfected: true, image: "images/cow1.png" },
  { id: 2, name: "소2", isInfected: false, image: "images/cow2.png" },
  { id: 3, name: "소3", isInfected: false, image: "images/cow3.png" },
  { id: 4, name: "소4", isInfected: true, image: "images/cow4.png" },
  { id: 5, name: "소5", isInfected: false, image: "images/cow5.png" },
];

/**
 * 소 상태를 HTML 요소로 생성
 * @param {Object} cow - 소 객체 { id, name, isInfected, image }
 * @returns {HTMLElement} - 소 상태를 나타내는 리스트 아이템
 */
function createCowElement(cow) {
  const cowItem = document.createElement("li");
  cowItem.className = `cow-item ${cow.isInfected ? "infected" : "healthy"}`;
  cowItem.innerHTML = `
      <div class="cow-details">
          <div class="cow-image" style="background-image: url('${cow.image}');"></div>
          <div class="cow-info">
              <h3>${cow.name}</h3>
              <div class="infection-status ${cow.isInfected ? "infected" : "healthy"}">
                  ${cow.isInfected ? "감염" : "건강"}
              </div>
          </div>
      </div>
  `;

  // 소 클릭 시 상세보기 페이지로 이동
  cowItem.addEventListener("click", () => {
    window.location.href = `Cow_Details.html?id=${cow.id}`;
  });

  return cowItem;
}

/**
 * 소 상태 데이터를 기반으로 UI를 렌더링
 * @param {Array} cows - 소 데이터 배열
 */
function renderCowList(cows) {
  const cowList = document.getElementById("cowList");
  cowList.innerHTML = ""; // 기존 리스트 초기화

  cows.forEach((cow) => {
    const cowItem = createCowElement(cow);
    cowList.appendChild(cowItem);
  });
}

// 페이지가 로드되었을 때 소 상태를 렌더링
document.addEventListener("DOMContentLoaded", () => renderCowList(cowData));

// Notification logic
document.addEventListener("DOMContentLoaded", () => {
  const notificationBell = document.getElementById("notification-bell");
  const notificationCount = document.getElementById("notification-count");
  const notificationPopup = document.getElementById("notification-popup");
  const notificationList = document.getElementById("notification-list");
  const closePopupButton = document.getElementById("close-notification-popup");

  // Fetch notifications from the server
  function fetchNotifications() {
    fetch("/api/notifications")
      .then((response) => response.json())
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          notificationCount.style.display = "block";
          notificationCount.textContent = data.notifications.length;

          // Populate the notification list
          notificationList.innerHTML = "";
          data.notifications.forEach((notification) => {
            const listItem = document.createElement("li");
            listItem.textContent = notification.message;
            notificationList.appendChild(listItem);
          });
        } else {
          notificationCount.style.display = "none";
        }
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }

  // Show or hide the notification popup
  notificationBell.addEventListener("click", () => {
    const isPopupVisible = notificationPopup.style.display === "block";
    notificationPopup.style.display = isPopupVisible ? "none" : "block";
  });

  // Close the notification popup
  closePopupButton.addEventListener("click", () => {
    notificationPopup.style.display = "none";
  });

  // Initial fetch of notifications
  fetchNotifications();
});
