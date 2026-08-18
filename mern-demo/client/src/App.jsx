import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Lấy danh sách sinh viên
  const getStudents = async () => {
    try {
      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error("Không lấy được dữ liệu");
      }

      const data = await response.json();
      setStudents(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Không kết nối được Backend!");
    }
  };

  // Chạy khi mở trang
  useEffect(() => {
    getStudents();
  }, []);

  // Thêm sinh viên
  const addStudent = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !email) {
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId,
          name: name,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Thêm sinh viên thất bại");
      }

      // Xóa dữ liệu trong form
      setStudentId("");
      setName("");
      setEmail("");

      setMessage("✅ Thêm sinh viên thành công!");

      // Tải lại danh sách
      getStudents();

    } catch (error) {
      console.error(error);
      setMessage("❌ Không thêm được sinh viên!");
    }
  };

  return (
    <div className="container">
      <h1>Quản lý sinh viên</h1>

      <h2>Thêm sinh viên</h2>

      <form onSubmit={addStudent} className="form">
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
          Thêm sinh viên
        </button>
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
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;