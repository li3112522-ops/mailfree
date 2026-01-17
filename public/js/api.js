/**
 * API 管理页面脚本 - iMail
 */

(function() {
  'use strict';

  // DOM 元素
  const logoutBtn = document.getElementById('logout');
  const toast = document.getElementById('toast');

  // Toast 提示
  function showToast(message, type = 'info') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 退出登录
  async function handleLogout() {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        showToast('已退出登录', 'success');
        setTimeout(() => {
          location.href = '/';
        }, 500);
      } else {
        showToast('退出失败，请重试', 'error');
      }
    } catch (e) {
      console.error('Logout error:', e);
      showToast('网络错误', 'error');
    }
  }

  // 复制到剪贴板
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板', 'success');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('已复制到剪贴板', 'success');
    } catch (e) {
      showToast('复制失败', 'error');
    }
    document.body.removeChild(textarea);
  }

  // 端点路径点击复制
  function initPathCopy() {
    document.querySelectorAll('.endpoint-path').forEach(el => {
      el.style.cursor = 'pointer';
      el.title = '点击复制';
      el.addEventListener('click', () => {
        copyToClipboard(el.textContent.trim());
      });
    });
  }

  // 代码块点击复制
  function initCodeCopy() {
    document.querySelectorAll('.code-block').forEach(block => {
      block.style.cursor = 'pointer';
      block.title = '点击复制代码';
      block.addEventListener('click', () => {
        const code = block.querySelector('pre')?.textContent || '';
        copyToClipboard(code);
      });
    });
  }

  // 折叠/展开详情
  function initToggle() {
    document.querySelectorAll('.endpoint-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const details = btn.nextElementSibling;
        if (details && details.classList.contains('endpoint-details-content')) {
          const isExpanded = btn.classList.toggle('expanded');
          details.style.display = isExpanded ? 'block' : 'none';
        }
      });
    });
  }

  // 初始化
  function init() {
    // 退出按钮
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

    // 初始化交互功能
    initPathCopy();
    initCodeCopy();
    initToggle();

    // 加载 footer
    loadFooter();
  }

  // 加载公共 footer
  async function loadFooter() {
    try {
      const res = await fetch('/templates/footer.html', { cache: 'no-cache' });
      const html = await res.text();
      const slot = document.getElementById('footer-slot');
      if (slot) {
        slot.outerHTML = html;
        setTimeout(() => {
          const y = document.getElementById('footer-year');
          if (y) y.textContent = new Date().getFullYear();
        }, 0);
      }
    } catch (e) {
      console.error('Failed to load footer:', e);
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
