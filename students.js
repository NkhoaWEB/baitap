const STUDENTS_API_URL = 'http://localhost:3001/students';

// Lấy danh sách sinh viên và hiển thị
async function fetchStudents() {
  try {
    const response = await fetch(STUDENTS_API_URL);
    if (!response.ok) throw new Error('Không thể tải danh sách sinh viên');
    const students = await response.json();
    renderTable(students);
  } catch (error) {
    alert(error.message);
  }
}

// Hiển thị bảng sinh viên
function renderTable(students) {
  const tableBody = document.getElementById('student-table');
  tableBody.innerHTML = students
    .map((student, index) => `
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
          <button class="btn btn-danger btn-sm" data-id="${student.id}" onclick="deleteStudentFromButton(this)">Xóa</button>
        </td>
      </tr>
    `).join('');
}

// Mở modal để sửa hoặc thêm sinh viên
function openModalFromButton(button) {
  const student = JSON.parse(button.getAttribute('data-student'));
  openModal(student);
}

// Mở modal thêm hoặc sửa
function openModal(student = {}) {
  const form = document.getElementById('studentForm');
  form.reset();

  // Điền thông tin của sinh viên vào form
  Object.keys(student).forEach((key) => {
    const element = document.getElementById(`student${capitalizeFirstLetter(key)}`);
    if (element) {
      element.value = student[key] || '';
    }
  });

  // Đặt giá trị ID sinh viên vào trường ẩn
  document.getElementById('studentId').value = student.id || '';

  // Hiển thị modal
  const modal = new bootstrap.Modal(document.getElementById('studentModal'));
  modal.show();
}

// Lưu sinh viên (thêm mới hoặc sửa)
async function saveStudent() {
  const student = {
    name: document.getElementById('studentName').value.trim(),
    age: parseInt(document.getElementById('studentAge').value.trim(), 10),
    gender: document.getElementById('studentGender').value.trim(),
    year: parseInt(document.getElementById('studentYear').value.trim(), 10),
    award: document.getElementById('studentAward').value.trim(),
    class: document.getElementById('studentClass').value.trim(),
  };

  const studentId = document.getElementById('studentId').value;

  if (Object.values(student).some(value => !value) || isNaN(student.age) || isNaN(student.year)) {
    alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
    return;
  }

  try {
    if (studentId) {
      await updateStudent(studentId, student);
    } else {
      await addStudent(student);
    }
    fetchStudents();
    const modal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
    modal.hide();
  } catch (error) {
    alert('Đã xảy ra lỗi, vui lòng thử lại!');
  }
}

// Thêm sinh viên mới
async function addStudent(student) {
  const response = await fetch(STUDENTS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Không thể thêm sinh viên');
  return await response.json();
}

// Cập nhật thông tin sinh viên
async function updateStudent(id, student) {
  const response = await fetch(`${STUDENTS_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Không thể cập nhật sinh viên');
  return await response.json();
}

// Xóa sinh viên
async function deleteStudentFromButton(button) {
  const id = button.getAttribute('data-id');
  if (!id) {
    alert('ID sinh viên không hợp lệ!');
    return;
  }

  if (!confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;

  try {
    const response = await fetch(`${STUDENTS_API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Không thể xóa sinh viên');
    fetchStudents();
  } catch (error) {
    alert('Đã xảy ra lỗi khi xóa sinh viên');
  }
}

// Hàm để viết hoa chữ cái đầu tiên
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Khởi động
fetchStudents();
