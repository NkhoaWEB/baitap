const API_URL = 'http://localhost:3001/users'; // URL API của bạn

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
  e.preventDefault(); // Ngừng hành động mặc định của form

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  // Kiểm tra nếu có trường nào để trống
  if (!username || !email || !password || !confirmPassword) {
    alert('Vui lòng điền đầy đủ tất cả các thông tin!');
    return;
  }

  // Kiểm tra mật khẩu có khớp không
  if (password !== confirmPassword) {
    alert('Mật khẩu không khớp!');
    return;
  }

  // Validation regex
  const usernameRegex = /^[A-Za-z0-9]{4,}$/; // Tên người dùng có thể chứa chữ và số, dài tối thiểu 4 ký tự
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/; // Mật khẩu cần ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt

  if (!usernameRegex.test(username)) {
    alert('Tên tài khoản phải dài hơn 4 ký tự và không chứa ký tự đặc biệt!');
    return;
  }
  if (!emailRegex.test(email)) {
    alert('Email không hợp lệ!');
    return;
  }
  if (!passwordRegex.test(password)) {
    alert('Mật khẩu phải dài hơn 6 ký tự, chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt!');
    return;
  }

  try {
    // Kiểm tra email đã tồn tại trong danh sách người dùng
    const users = await fetchData(API_URL); // Lấy danh sách người dùng
    if (users.some(user => user.email === email)) {
      alert('Email này đã được đăng ký!');
      return;
    }

    // Tạo người dùng mới
    const newUser = { username, email, password };
    await fetchData(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    alert('Đăng ký thành công!');
    document.getElementById('register-form').reset(); // Reset form sau khi đăng ký thành công
    switchToLogin();  // Chuyển sang form đăng nhập
  } catch (error) {
    console.error('Error occurred during registration:', error);  // In chi tiết lỗi
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

// Chuyển giữa các form đăng ký và đăng nhập
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});
