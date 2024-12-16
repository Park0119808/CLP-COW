// 웹캠 활성화
const video = document.querySelector('#webcam');
const captureButton = document.querySelector('#capture');
const canvas = document.querySelector('#canvas');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((error) => {
            console.error('웹캠을 활성화할 수 없습니다:', error);
        });
} else {
    alert('웹캠 기능이 지원되지 않는 브라우저입니다.');
}

// 캡처 버튼 이벤트
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캡처한 이미지를 base64 데이터로 변환
    const imageData = canvas.toDataURL('image/png');

    // 서버에 이미지 업로드
    fetch('/upload_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
    })
        .then(response => response.json())
        .then(data => {
            console.log('이미지 업로드 성공:', data.message);
            alert('이미지가 서버에 업로드되었습니다.');
        })
        .catch(error => {
            console.error('이미지 업로드 실패:', error);
        });
});
