import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    email: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // =========================
  // CÂU 47 + CÂU 63
  // Lấy danh sách sinh viên
  // =========================
  const loadStudents = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu");
      }

      const data = await response.json();
      setStudents(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Không kết nối được Backend!");
    }
  };

  // Tự động tải danh sách khi mở trang
  useEffect(() => {
    loadStudents();
  }, []);

  // =========================
  // Xử lý nhập Form
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CÂU 49 + CÂU 61
  // Thêm hoặc cập nhật sinh viên
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.name || !form.email) {
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      let response;

      if (editingId) {
        // CÂU 61 - PUT
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else {
        // CÂU 49 - POST
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      }

      if (!response.ok) {
        throw new Error("Request thất bại");
      }

      if (editingId) {
        setMessage("✅ Cập nhật sinh viên thành công!");
      } else {
        setMessage("✅ Thêm sinh viên thành công!");
      }

      // Xóa form
      setForm({
        studentId: "",
        name: "",
        email: "",
      });

      setEditingId(null);

      // Tải lại danh sách
      await loadStudents();
    } catch (error) {
      console.error(error);
      setMessage("❌ Có lỗi khi gửi dữ liệu!");
    }
  };

  // =========================
  // CÂU 61
  // Chọn sinh viên để sửa
  // =========================
  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });

    setEditingId(student._id);

    setMessage("✏️ Đang chỉnh sửa sinh viên...");
    
    // Cuộn lên đầu trang
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Hủy sửa
  // =========================
  const handleCancelEdit = () => {
    setForm({
      studentId: "",
      name: "",
      email: "",
    });

    setEditingId(null);
    setMessage("");
  };

  // =========================
  // CÂU 62
  // Xóa sinh viên
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Xóa thất bại");
      }

      setMessage("🗑️ Xóa sinh viên thành công!");

      // Tải lại danh sách
      await loadStudents();
    } catch (error) {
      console.error(error);
      setMessage("❌ Không thể xóa sinh viên!");
    }
  };

  return (
    <div className="container">
      <h1>🎓 Quản lý sinh viên</h1>

      {/* =========================
          FORM
      ========================= */}
      <div className="form-box">
        <h2>
          {editingId ? "✏️ Cập nhật sinh viên" : "➕ Thêm sinh viên"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="studentId"
            placeholder="MSSV"
            value={form.studentId}
            onChange={handleChange}
          />

          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? "💾 Cập nhật" : "➕ Thêm sinh viên"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancelEdit}
            >
              Hủy
            </button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </div>

      {/* =========================
          DANH SÁCH SINH VIÊN
      ========================= */}
      <div className="list-box">
        <div className="list-header">
          <h2>📋 Danh sách sinh viên</h2>

          <button className="refresh-btn" onClick={loadStudents}>
            🔄 Làm mới
          </button>
        </div>

        {students.length === 0 ? (
          <p className="empty">Chưa có sinh viên.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>MSSV</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(student)}
                      >
                        ✏️ Sửa
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(student._id)}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
         
      ========================= */}
      
    </div>
  );
}

export default App;