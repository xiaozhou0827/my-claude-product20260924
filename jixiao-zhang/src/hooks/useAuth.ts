import type { Expense, Income, Budget, Category } from '../types';

export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  createdAt: number;
}

export interface UserData {
  user: User | null;
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
}

const USERS_KEY = 'jixiao-zhang-users';
const CURRENT_USER_KEY = 'jixiao-zhang-current-user';
const DATA_KEY_PREFIX = 'jixiao-zhang-data-';

export interface UserCredentials {
  username: string;
  password: string;
  nickname: string;
}

export function useAuth() {
  const getUsers = () => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const saveUsers = (users: Record<string, UserCredentials>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const getStoredData = (userId: string): UserData => {
    try {
      const stored = localStorage.getItem(DATA_KEY_PREFIX + userId);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse storage:', e);
    }
    return {
      user: null,
      expenses: [],
      incomes: [],
      budget: { monthlyLimit: 3000, categoryLimits: {} as Record<string, number> },
    };
  };

  const saveData = (userId: string, data: UserData) => {
    try {
      localStorage.setItem(DATA_KEY_PREFIX + userId, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  };

  const register = (credentials: UserCredentials): { success: boolean; message: string } => {
    const users = getUsers();
    if (users[credentials.username]) {
      return { success: false, message: '用户名已存在' };
    }
    if (credentials.username.length < 3) {
      return { success: false, message: '用户名至少3个字符' };
    }
    if (credentials.password.length < 6) {
      return { success: false, message: '密码至少6个字符' };
    }
    const user: User = {
      id: Date.now().toString(),
      username: credentials.username,
      nickname: credentials.nickname || credentials.username,
      createdAt: Date.now(),
    };
    users[credentials.username] = {
      username: credentials.username,
      password: credentials.password,
      nickname: credentials.nickname || credentials.username,
    };
    saveUsers(users);
    saveData(user.id, { user, expenses: [], incomes: [], budget: { monthlyLimit: 3000, categoryLimits: {} as Record<Category, number> } });
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return { success: true, message: '注册成功' };
  };

  const login = (username: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = getUsers();
    const credentials = users[username];
    if (!credentials || credentials.password !== password) {
      return { success: false, message: '用户名或密码错误' };
    }
    const storedData = getStoredData(username);
    if (!storedData.user) {
      const newUser: User = {
        id: Date.now().toString(),
        username,
        nickname: credentials.nickname || username,
        createdAt: Date.now(),
      };
      saveData(username, { user: newUser, expenses: [], incomes: [], budget: { monthlyLimit: 3000, categoryLimits: {} as Record<string, number> } });
      localStorage.setItem(CURRENT_USER_KEY, username);
      return { success: true, message: '登录成功', user: newUser };
    }
    localStorage.setItem(CURRENT_USER_KEY, username);
    return { success: true, message: '登录成功', user: storedData.user };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const getCurrentUserId = () => {
    return localStorage.getItem(CURRENT_USER_KEY);
  };

  const getCurrentUser = (): User | null => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    const data = getStoredData(userId);
    return data.user;
  };

  return {
    register,
    login,
    logout,
    getCurrentUser,
    getCurrentUserId,
    getStoredData,
    saveData,
  };
}
