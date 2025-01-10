const API_URL = 'http://localhost:5001/users'; // Thay bằng URL API của bạn
const STUDENTS_API_URL = 'http://localhost:5001/students'; // Thay bằng URL API của bạn

// Hàm gọi API
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

// Đăng ký
document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  // Kiểm tra nếu có trường nào để trống
  if (!username || !email || !password || !confirmPassword) {
    alert('Vui lòng điền đầy đủ tất cả các thông tin!');
    return;
  }

  // Validation
  const usernameRegex = /^[A-Za-z0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;

  if (!usernameRegex.test(username)) {
    alert('Tên phải dài hơn 4 ký tự và không chứa khoảng trắng, số hoặc ký tự đặc biệt!');
    return;
  }
  if (!emailRegex.test(email)) {
    alert('Email không hợp lệ!');
    return;
  }
  if (!passwordRegex.test(password)) {
    alert('Mật khẩu phải dài hơn 4 ký tự, chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt!');
    return;
  }
  if (password !== confirmPassword) {
    alert('Mật khẩu không khớp!');
    return;
  }

  try {
    // Gửi dữ liệu đăng ký lên server
    const existingUsers = await fetchData(API_URL);
    if (existingUsers.some(user => user.email === email)) {
      alert('Email đã tồn tại!');
      return;
    }

    const newUser = { username, email, password };
    await fetchData(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    alert('Đăng ký thành công!');
    document.getElementById('register-form').reset();
    switchToLogin();  // Sau khi đăng ký thành công, chuyển sang form đăng nhập
  } catch (error) {
    alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
  }
});

// Đăng nhập
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  // Kiểm tra nếu có trường nào để trống
  if (!username || !password) {
    alert('Vui lòng điền đầy đủ tên và mật khẩu!');
    return;
  }

  try {
    const users = await fetchData(API_URL);
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      alert('Đăng nhập thành công! Chuyển đến trang chủ...');
      window.location.href = 'homepage.html'; // Thay bằng URL trang chủ
    } else {
      alert('Tên hoặc mật khẩu không đúng!');
    }
  } catch (error) {
    alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
  }
});
