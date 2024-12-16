// 소 데이터 정의
const cowData = [
  { id: 1, name: "소1", isInfected: true, image: "images/cow1.png", details: "images/Numpy Skin1.jpg" },
  { id: 2, name: "소2", isInfected: false, image: "images/cow2.png", details: null },
  { id: 3, name: "소3", isInfected: false, image: "images/cow3.png", details: null },
  {
    id: 4,
    name: "소4",
    isInfected: true,
    image: "images/cow4.png",
    details: "images/Numpy Skin1.jpg",
    details: "images/Numpy Skin2.jpg",
  },
  { id: 5, name: "소5", isInfected: false, image: "images/cow5.png", details: null },
];

// URL에서 ID 파라미터 추출
function getCowIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"), 10);
}

// 선택된 소 데이터를 표시
function displayCowDetails() {
  const cowId = getCowIdFromURL();
  const cow = cowData.find((c) => c.id === cowId);

  const cowDetails = document.getElementById("cowDetails");
  if (cow) {
    cowDetails.innerHTML = `
          <div class="cow-face" style="background-image: url('${cow.image}')"></div>
          <h2>${cow.name}</h2>
          ${
            cow.details
              ? `<p>럼피스킨 감염 부위:</p>
                     <img src="${cow.details}" class="infected-image" onclick="openImageModal('${cow.details}')">`
              : `<p>이상 없음</p>`
          }
      `;
  } else {
    alert("소 정보를 찾을 수 없습니다.");
    window.location.href = "MainPage.html";
  }
}

// 모달 열기
function openImageModal(imageSrc) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
      <div class="modal-content">
          <img src="${imageSrc}" alt="확대 이미지" class="modal-image">
          <span class="close" onclick="closeModal()">&times;</span>
      </div>
  `;
  document.body.appendChild(modal);
}

// 모달 닫기
function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) modal.remove();
}

document.addEventListener("DOMContentLoaded", displayCowDetails);
