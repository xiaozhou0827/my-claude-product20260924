/**
 * 记小账 - 认证模块
 * 处理用户注册、登录、会话管理
 */

const AUTH_STORAGE = 'jixiao_zhang_users';
const SESSION_STORAGE = 'jixiao_zhang_session';

// 获取所有用户
function getUsers() {
  const data = localStorage.getItem(AUTH_STORAGE);
  return data ? JSON.parse(data) : [];
}

// 保存用户列表
function saveUsers(users) {
  localStorage.setItem(AUTH_STORAGE, JSON.stringify(users));
}

// 获取当前会话
function getSession() {
  const data = localStorage.getItem(SESSION_STORAGE);
  return data ? JSON.parse(data) : null;
}

// 设置会话
function setSession(user) {
  localStorage.setItem(SESSION_STORAGE, JSON.stringify({
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    loginTime: Date.now()
  }));
}

// 清除会话
function clearSession() {
  localStorage.removeItem(SESSION_STORAGE);
}

// 检查是否已登录
function isLoggedIn() {
  return !!getSession();
}

// 获取当前用户
function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.id === session.id) || null;
}

// 注册
function register(username, password, nickname) {
  const users = getUsers();

  // 验证用户名
  if (username.length < 3) {
    return { success: false, message: '用户名至少3个字符' };
  }

  // 验证密码
  if (password.length < 6) {
    return { success: false, message: '密码至少6个字符' };
  }

  // 检查用户名是否已存在
  if (users.find(u => u.username === username)) {
    return { success: false, message: '用户名已存在' };
  }

  // 创建新用户
  const newUser = {
    id: Date.now().toString(),
    username,
    password, // 实际项目应加密存储
    nickname: nickname || username,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // 自动登录
  setSession(newUser);

  return { success: true, message: '注册成功', user: newUser };
}

// 登录
function login(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return { success: false, message: '用户名或密码错误' };
  }

  setSession(user);
  return { success: true, message: '登录成功', user };
}

// 退出登录
function logout() {
  clearSession();
  window.location.href = 'login.html';
}

// 更新用户资料
function updateProfile(userId, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) return { success: false, message: '用户不存在' };

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  // 更新会话
  const session = getSession();
  if (session && session.id === userId) {
    setSession({ ...session, ...updates });
  }

  return { success: true, message: '资料已更新' };
}

// 修改密码
function changePassword(userId, oldPassword, newPassword) {
  if (newPassword.length < 6) {
    return { success: false, message: '新密码至少6个字符' };
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return { success: false, message: '用户不存在' };
  if (user.password !== oldPassword) {
    return { success: false, message: '原密码错误' };
  }

  user.password = newPassword;
  saveUsers(users);

  return { success: true, message: '密码修改成功' };
}

// 初始化认证检查
function initAuthCheck() {
  if (isLoggedIn()) {
    const user = getCurrentUser();
    if (user) {
      // 已登录，显示用户信息
      const nicknameEl = document.getElementById('userNickname');
      if (nicknameEl) nicknameEl.textContent = user.nickname;

      const greetingEl = document.getElementById('greeting');
      if (greetingEl) {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';
        greetingEl.textContent = `${greeting}，${user.nickname} 🌸`;
      }
      return true;
    }
  }

  // 未登录，跳转到登录页
  window.location.href = 'login.html';
  return false;
}
