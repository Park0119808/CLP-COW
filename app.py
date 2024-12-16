from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # CORS 설정

# MongoDB 연결 설정
client = MongoClient('mongodb://localhost:27017/')
user_db = client['lumpy']  # 회원 관련 DB
users_collection = user_db['Member_information']

webcam_db = client['webcam_db']  # 웹캠 관련 DB
images_collection = webcam_db['images']

# 메인 페이지
@app.route('/')
def home():
    return render_template('index.html')

# MainLogin 페이지를 /MainLogin.html 경로로 설정
@app.route('/MainLogin.html')
def main_login():
    return render_template('MainLogin/MainLogin.html')

# 회원가입 페이지를 /SignUp.html 경로로 설정
@app.route('/SignUp.html')
def sign_up():
    return render_template('MainLogin/SignUp.html')

# MainPage 및 관련 페이지
@app.route('/MainPage')
def main_page():
    return render_template('MainPage.html')

@app.route('/Cow_Details.html')
def cow_details():
    # URL에서 'id' 파라미터 가져오기
    cow_id = request.args.get('id')
    if not cow_id:
        return "소 ID가 제공되지 않았습니다.", 400

    # 예제 데이터 (MongoDB 또는 실제 데이터베이스로 대체 가능)
    cow_data = {
        "1": {"name": "소1", "status": "감염", "image": "/static/images/cow1.png"},
        "2": {"name": "소2", "status": "건강", "image": "/static/images/cow2.png"},
        "3": {"name": "소3", "status": "건강", "image": "/static/images/cow3.png"}

    }
    # 소 정보 조회
    cow = cow_data.get(cow_id)
    if not cow:
        return "소 정보를 찾을 수 없습니다.", 404
    return render_template('Cow_Details.html', cow=cow)

# 알림 데이터 반환
@app.route('/api/notifications')
def get_notifications():
    notifications = [
        {"id": 1, "message": "소1 상태 확인 필요"},
        {"id": 2, "message": "소2 상태 정상"},
    ]
    return jsonify(notifications)

# 사용자 세션 정보 반환
@app.route('/session')
def get_session():
    user_data = {"id": "test_user", "name": "사용자"}
    return jsonify({"user": user_data})

# 회원가입 처리
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        id = data.get('id')
        password = data.get('password')

        if not id or not password:
            return jsonify({"message": "ID와 비밀번호를 입력해주세요."}), 400

        # ID 중복 확인
        if users_collection.find_one({'id': id}):
            return jsonify({"message": "이미 존재하는 ID입니다."}), 400

        # MongoDB에 ID와 일반 텍스트 비밀번호 저장
        users_collection.insert_one({'id': id, 'password': password})
        return jsonify({"message": f"회원가입 성공! ID: {id}"}), 200
    except Exception as e:
        return jsonify({"message": f"회원가입 처리 중 오류: {str(e)}"}), 500

# 웹캠 이미지 업로드
@app.route('/upload_image', methods=['POST'])
def upload_image():
    try:
        data = request.get_json()
        image_base64 = data.get('image')

        if not image_base64:
            return jsonify({"message": "이미지가 제공되지 않았습니다."}), 400

        image_data = base64.b64decode(image_base64.split(',')[1])
        filename = f"captured_image_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
        with open(filename, 'wb') as f:
            f.write(image_data)

        images_collection.insert_one({
            'image': image_base64,
            'timestamp': datetime.now()
        })

        return jsonify({"message": "이미지가 성공적으로 저장되었습니다."}), 200
    except Exception as e:
        return jsonify({"message": f"이미지 처리 중 오류: {str(e)}"}), 500

# 로그인 처리
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        id = data.get('id')
        password = data.get('password')

        if not id or not password:
            return jsonify({"message": "ID와 비밀번호를 입력해주세요."}), 400

        # MongoDB에서 사용자 조회 및 비밀번호 비교
        user = users_collection.find_one({'id': id})
        if user and user['password'] == password:
            return jsonify({"message": "로그인 성공!"}), 200
        else:
            return jsonify({"message": "ID 또는 비밀번호가 올바르지 않습니다."}), 401
    except Exception as e:
        return jsonify({"message": f"로그인 처리 중 오류: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
