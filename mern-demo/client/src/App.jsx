import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");

    // Lấy danh sách sinh viên
    const fetchStudents = async () => {
        try {
            const response = await fetch("/api/students");

            if (!response.ok) {
                throw new Error("Không thể lấy danh sách sinh viên");
            }

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error(error);
            setMessage("❌ Không thể lấy danh sách sinh viên!");
        }
    };

    // Chạy khi mở trang
    useEffect(() => {
        fetchStudents();
    }, []);

    // Thêm hoặc cập nhật sinh viên
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId || !name || !email) {
            setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            let response;

            if (editingId) {
                // CÂU 77 - PUT
                response = await fetch(`/api/students/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentId,
                        name,
                        email,
                    }),
                });
            } else {
                // CÂU 75 - POST
                response = await fetch("/api/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentId,
                        name,
                        email,
                    }),
                });
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Có lỗi xảy ra");
            }

            if (editingId) {
                setMessage("✅ Cập nhật sinh viên thành công!");
            } else {
                setMessage("✅ Thêm sinh viên thành công!");
            }

            // Xóa form
            setStudentId("");
            setName("");
            setEmail("");
            setEditingId(null);

            // Tải lại danh sách
            fetchStudents();

        } catch (error) {
            console.error(error);
            setMessage("❌ " + error.message);
        }
    };

    // Bắt đầu sửa
    const handleEdit = (student) => {
        setEditingId(student._id);
        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);

        setMessage("✏️ Đang chỉnh sửa sinh viên...");
    };

    // Hủy sửa
    const handleCancelEdit = () => {
        setEditingId(null);
        setStudentId("");
        setName("");
        setEmail("");
        setMessage("");
    };

    // Xóa sinh viên
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa sinh viên này không?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            // CÂU 78 - DELETE
            const response = await fetch(`/api/students/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Không thể xóa sinh viên");
            }

            setMessage("✅ Xóa sinh viên thành công!");

            // Tải lại danh sách
            fetchStudents();

        } catch (error) {
            console.error(error);
            setMessage("❌ " + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Quản lý sinh viên</h1>

            <h2>
                {editingId
                    ? "Cập nhật sinh viên"
                    : "Thêm sinh viên"}
            </h2>

            <form onSubmit={handleSubmit} className="student-form">

                <input
                    type="text"
                    placeholder="MSSV"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">
                    {editingId ? "Cập nhật" : "Thêm sinh viên"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                    >
                        Hủy
                    </button>
                )}
            </form>

            {message && (
                <p className="message">
                    {message}
                </p>
            )}

            <h2>Danh sách sinh viên</h2>

            {students.length === 0 ? (
                <p>Chưa có sinh viên.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>MSSV</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.studentId}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleEdit(student)
                                        }
                                    >
                                        ✏️ Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(student._id)
                                        }
                                    >
                                        🗑️ Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;