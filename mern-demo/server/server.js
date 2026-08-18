const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Hello
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend đang hoạt động!"
    });
});

// Câu 36 - GET
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy danh sách sinh viên",
            error: error.message
        });
    }
});

// Câu 37 - POST
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi thêm sinh viên",
            error: error.message
        });
    }
});

// Câu 38 - PUT
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            message: "Lỗi cập nhật sinh viên",
            error: error.message
        });
    }
});

// Câu 39 - DELETE
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công"
        });
    } catch (error) {
        res.status(400).json({
            message: "Lỗi xóa sinh viên",
            error: error.message
        });
    }
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });