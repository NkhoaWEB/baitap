const STUDENTS_API_URL = 'http://localhost:5001/students'; // URL API cho sinh viên
let editingStudentId = null;

// Lấy danh sách sinh viên từ API và hiển thị
async function fetchStudents() {
  try {
    const response = await fetch(STUDENTS_API_URL);
    const students = await response.json();
    renderTable(students);
  } catch (error) {
    alert('Không thể tải danh sách sinh viên. Hãy kiểm tra kết nối đến server.');
  }
}

// Hiển thị bảng sinh viên
function renderTable(students) {
  const tableBody = document.getElementById('student-table');
  tableBody.innerHTML = students.map((student, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.gender}</td>
      <td>${student.year}</td>
      <td>${student.award}</td>
      <td>${student.class}</td>
      <td>
        <button class="btn btn-warning btn-sm" data-student='${JSON.stringify(student)}' onclick="openModalFromButton(this)">Sửa</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Xóa</button>
      </td>
    </tr>`).join('');
}

// Mở modal thêm mới hoặc sửa từ nút bấm
function openModalFromButton(button) {
  const student = JSON.parse(button.getAttribute('data-student'));
  openModal(student);
}

// Mở modal thêm mới hoặc sửa
function openModal(student = {}) {
  editingStudentId = student.id || null;
  const form = document.getElementById('studentForm');
  form.reset();

  // Điền thông tin cũ của sinh viên vào form
  Object.keys(student).forEach(key => {
    const elementId = `student${capitalizeFirstLetter(key)}`;
    if (document.getElementById(elementId)) {
      document.getElementById(elementId).value = student[key] || '';
    }
  });

  // Hiển thị modal
  new bootstrap.Modal(document.getElementById('studentModal')).show();
}

// Lưu sinh viên (thêm hoặc sửa)
async function saveStudent() {
  const student = {
    name: document.getElementById('studentName').value.trim(),
    age: parseInt(document.getElementById('studentAge').value.trim(), 10),
    gender: document.getElementById('studentGender').value.trim(),
    year: parseInt(document.getElementById('studentYear').value.trim(), 10),
    award: document.getElementById('studentAward').value.trim(),
    class: document.getElementById('studentClass').value.trim(),
  };

  // Kiểm tra dữ liệu nhập vào
  if (!student.name || isNaN(student.age) || !student.gender || isNaN(student.year) || !student.award || !student.class) {
    alert('Vui lòng điền đầy đủ thông tin chính xác!');
    return;
  }

  try {
    const options = {
      method: editingStudentId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    };
    const url = editingStudentId ? `${STUDENTS_API_URL}/${editingStudentId}` : STUDENTS_API_URL;
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Không thể lưu sinh viên.');
    
    // Đóng modal và làm mới danh sách sinh viên
    new bootstrap.Modal(document.getElementById('studentModal')).hide();
    fetchStudents();
  } catch (error) {
    alert('Đã xảy ra lỗi, vui lòng thử lại!');
  }
}


// Xóa sinh viên
async function deleteStudent(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;
  try {
    const response = await fetch(`${STUDENTS_API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Không thể xóa sinh viên.');
    fetchStudents();
  } catch (error) {
    alert('Không thể xóa sinh viên. Hãy kiểm tra lại server.');
  }
}

// Chuyển đổi chữ cái đầu tiên thành chữ hoa
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Khởi động
fetchStudents();
