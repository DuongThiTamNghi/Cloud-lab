import { useEffect, useState } from "react";

interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
}

function App() {
  // =========================
  // CÂU 48: FORM THÊM
  // =========================
  const API_URL = "https://curly-guacamole-q97wr7rrpx6h6xvj-5000.app.github.dev";
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // CÂU 47: DANH SÁCH
  // =========================
  const [students, setStudents] = useState<Student[]>([]);

  // =========================
  // CÂU 61: SỬA SINH VIÊN
  // =========================
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStudentId, setEditStudentId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sinh viên");
      }

      const data: Student[] = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // =========================
  // CÂU 49: THÊM SINH VIÊN
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/students`, {
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

      if (!response.ok) {
        throw new Error("Không thể thêm sinh viên");
      }

      const data = await response.json();

      console.log("Sinh viên vừa thêm:", data);

      alert("Thêm sinh viên thành công!");

      setStudentId("");
      setName("");
      setEmail("");

      loadStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể thêm sinh viên!");
    }
  };

  // =========================
  // CÂU 61: BẤM NÚT SỬA
  // =========================
  const handleEdit = (student: Student) => {
    setEditingId(student._id);

    setEditStudentId(student.studentId);
    setEditName(student.name);
    setEditEmail(student.email);
  };

  // =========================
  // CÂU 61: CẬP NHẬT SINH VIÊN
  // PUT /api/students/:id
  // =========================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${editingId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          studentId: editStudentId,
          name: editName,
          email: editEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật sinh viên");
      }

      alert("Cập nhật sinh viên thành công!");

      // Thoát chế độ sửa
      setEditingId(null);

      // Tải lại danh sách
      loadStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể cập nhật sinh viên!");
    }
  };

  // =========================
  // CÂU 62: XÓA SINH VIÊN
  // DELETE /api/students/:id
  // =========================
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa sinh viên");
      }

      alert("Xóa sinh viên thành công!");

      // Tải lại danh sách
      loadStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể xóa sinh viên!");
    }
  };

  // =========================
  // HỦY SỬA
  // =========================
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h1>Thêm sinh viên</h1>

      {/* =========================
          CÂU 48 + CÂU 49
      ========================= */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>

          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
            required
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <br />

        <div>
          <label>Email: </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập Email"
            required
          />
        </div>

        <br />

        <button type="submit">
          Thêm sinh viên
        </button>
      </form>

      <h1>Danh sách sinh viên</h1>

      {/* =========================
          CÂU 47 + CÂU 61 + CÂU 62
      ========================= */}
      <table border={1}>
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
                <button onClick={() => handleEdit(student)}>
                  Sửa
                </button>

                {" "}

                <button onClick={() => handleDelete(student._id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =========================
          FORM CẬP NHẬT - CÂU 61
      ========================= */}
      {editingId && (
        <div>
          <h1>Cập nhật sinh viên</h1>

          <form onSubmit={handleUpdate}>
            <div>
              <label>MSSV: </label>

              <input
                type="text"
                value={editStudentId}
                onChange={(e) => setEditStudentId(e.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Họ tên: </label>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Email: </label>

              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </div>

            <br />

            <button type="submit">
              Cập nhật
            </button>

            {" "}

            <button type="button" onClick={handleCancelEdit}>
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;