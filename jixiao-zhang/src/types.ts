export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
  paymentMethod: PaymentMethod;
  createdAt: number;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  note?: string;
  createdAt: number;
}

export interface Budget {
  monthlyLimit: number;
  categoryLimits: Record<Category, number>;
}

export type Category = '餐饮' | '交通' | '购物' | '娱乐' | '医疗' | '教育' | '居住' | '其他';
export type PaymentMethod = '现金' | '微信' | '支付宝' | '信用卡' | '其他';

export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  createdAt: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  '餐饮': '#FFB4B8',
  '交通': '#B5D8F7',
  '购物': '#C7CEEA',
  '娱乐': '#D4A5D0',
  '医疗': '#A8E6CF',
  '教育': '#FFEAA7',
  '居住': '#D4B8A0',
  '其他': '#E8E8E8',
};

export const PAYMENT_METHODS: PaymentMethod[] = ['现金', '微信', '支付宝', '信用卡', '其他'];
export const CATEGORIES: Category[] = ['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '居住', '其他'];
