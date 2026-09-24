/**
 * 记小账 - 底部导航组件
 */

function renderBottomNav(currentPage) {
  const navItems = [
    { href: 'pages/home.html', icon: 'ph:house', label: '首页', id: 'nav-home' },
    { href: 'pages/bills.html', icon: 'ph:receipt', label: '账单', id: 'nav-bills' },
    { href: 'pages/stats.html', icon: 'ph:chart-pie-slice', label: '统计', id: 'nav-stats' },
    { href: 'pages/budget.html', icon: 'ph:wallet', label: '预算', id: 'nav-budget' },
    { href: 'pages/profile.html', icon: 'ph:user', label: '我的', id: 'nav-profile' },
  ];

  const isActive = (page) => currentPage.includes(page) ? 'active' : '';

  return `
    <nav class="bottom-nav">
      ${navItems.map(item => `
        <a href="${item.href}" class="nav-item ${isActive(item.id)}" id="${item.id}">
          <iconify-icon icon="${item.icon}"></iconify-icon>
          <span>${item.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeItem = document.getElementById(`nav-${page}`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
}
