const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "lumpy";

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "test_updated")));

// 회원가입 API
app.post("/signup", async (req, res) => {
    const { id, password } = req.body;

    try {
        // MongoDB 연결
        await client.connect();
        const db = client.db("lumpy");
        const collection = db.collection("Member_information");

        // 중복 아이디 확인
        const existingUser = await collection.findOne({ id });
        if (existingUser) {
            return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
        }

        // 사용자 데이터 저장
        const result = await collection.insertOne({ id, password });
        res.status(201).json({ message: "회원가입 성공", id: result.insertedId });
    } catch (error) {
        console.error("회원가입 오류:", error); // 오류 로그 출력
        res.status(500).json({ message: "서버 오류", error });
    } finally {
        await client.close();
    }
});

// 로그인 API
app.post("/login", async (req, res) => {
    const { id, password } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("Member_information");

        const user = await collection.findOne({ id });
        if (!user) {
            return res.status(400).json({ message: "존재하지 않는 아이디입니다." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        res.status(200).json({ message: "로그인 성공" });
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error });
    } finally {
        await client.close();
    }
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

