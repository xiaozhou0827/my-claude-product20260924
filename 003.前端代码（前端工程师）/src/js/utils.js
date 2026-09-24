/**
 * 记小账 - 通用工具函数
 */

// Toast 提示
function showToast(message, duration = 2400) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.querySelector('.phone-container')?.appendChild(toast);
  }
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }
}

// Modal 操作
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// 金额格式化
function formatMoney(amount) {
  return '¥' + parseFloat(amount).toFixed(2);
}

// 日期格式化
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  const sameDay = (d) => d.getFullYear() === today.getFullYear() &&
                         d.getMonth() === today.getMonth() &&
                         d.getDate() === today.getDate();
  const prevDay = (d) => d.getFullYear() === yesterday.getFullYear() &&
                          d.getMonth() === yesterday.getMonth() &&
                          d.getDate() === yesterday.getDate();

  if (sameDay(date)) return '今天';
  if (prevDay(date)) return '昨天';

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// 获取分类图标
function getCategoryEmoji(category) {
  const emojis = {
    '餐饮': '🍜',
    '交通': '🚌',
    '购物': '🛍️',
    '娱乐': '🎬',
    '医疗': '💊',
    '教育': '📚',
    '住房': '🏠',
    '工资': '💰',
    '其他': '📦'
  };
  return emojis[category] || '📦';
}

// 获取分类颜色
function getCategoryColor(category) {
  const colors = {
    '餐饮': '#FFE4E9',
    '交通': '#E3F5EC',
    '购物': '#EFEFFA',
    '娱乐': '#FFF6DC',
    '医疗': '#FFE9EC',
    '教育': '#E9F1FF',
    '住房': '#F3EDFF',
    '工资': '#E3F5EC',
    '其他': '#F5F5F5'
  };
  return colors[category] || '#F5F5F5';
}

// 数字动画
function animateNumber(element, target, duration = 500) {
  const start = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = start + (target - start) * easeProgress;

    element.textContent = formatMoney(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatMoney(target);
    }
  }

  requestAnimationFrame(update);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 自动隐藏模态框点击外部
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
      }
    });
  });
});
