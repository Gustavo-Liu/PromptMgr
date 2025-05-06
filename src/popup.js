// 存储相关的常量
const STORAGE_KEY = 'prompts';

// DOM元素
const promptList = document.getElementById('promptList');
const addPromptBtn = document.getElementById('addPromptBtn');
const addPromptModal = document.getElementById('addPromptModal');
const addPromptForm = document.getElementById('addPromptForm');
const cancelBtn = document.getElementById('cancelBtn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadPrompts();
  setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
  addPromptBtn.addEventListener('click', () => {
    addPromptModal.classList.add('show');
  });

  cancelBtn.addEventListener('click', () => {
    addPromptModal.classList.remove('show');
    addPromptForm.reset();
  });

  addPromptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('promptTitle').value;
    const content = document.getElementById('promptContent').value;
    addPrompt(title, content);
    addPromptModal.classList.remove('show');
    addPromptForm.reset();
  });
}

// 加载所有prompts
async function loadPrompts() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const prompts = result[STORAGE_KEY] || [];
  displayPrompts(prompts);
}

// 显示prompts列表
function displayPrompts(prompts) {
  promptList.innerHTML = '';
  prompts.forEach((prompt, index) => {
    const promptElement = createPromptElement(prompt, index);
    promptList.appendChild(promptElement);
  });
}

// 创建单个prompt元素
function createPromptElement(prompt, index) {
  const div = document.createElement('div');
  div.className = 'prompt-item';
  div.innerHTML = `
    <div class="prompt-header">
      <span class="prompt-title">${prompt.title}</span>
      <span class="prompt-date">${new Date(prompt.date).toLocaleString()}</span>
    </div>
    <div class="prompt-content">${prompt.content}</div>
    <div class="prompt-actions">
      <button class="btn edit-btn">Edit</button>
      <button class="btn delete-btn">Delete</button>
      <button class="btn primary copy-btn">Copy</button>
    </div>
  `;

  // 添加事件监听器
  const editBtn = div.querySelector('.edit-btn');
  const deleteBtn = div.querySelector('.delete-btn');
  const copyBtn = div.querySelector('.copy-btn');

  editBtn.addEventListener('click', () => editPrompt(index));
  deleteBtn.addEventListener('click', () => deletePrompt(index));
  copyBtn.addEventListener('click', () => copyPrompt(index));

  return div;
}

// 添加新prompt
async function addPrompt(title, content) {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const prompts = result[STORAGE_KEY] || [];
  
  prompts.push({
    title,
    content,
    date: Date.now()
  });

  await chrome.storage.local.set({ [STORAGE_KEY]: prompts });
  loadPrompts();
}

// 编辑prompt
async function editPrompt(index) {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const prompts = result[STORAGE_KEY] || [];
  const prompt = prompts[index];

  document.getElementById('promptTitle').value = prompt.title;
  document.getElementById('promptContent').value = prompt.content;
  addPromptModal.classList.add('show');

  // 修改表单提交处理
  const originalSubmitHandler = addPromptForm.onsubmit;
  addPromptForm.onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('promptTitle').value;
    const content = document.getElementById('promptContent').value;

    prompts[index] = {
      title,
      content,
      date: prompt.date // 保持原始日期
    };

    await chrome.storage.local.set({ [STORAGE_KEY]: prompts });
    addPromptModal.classList.remove('show');
    addPromptForm.reset();
    addPromptForm.onsubmit = originalSubmitHandler;
    loadPrompts();
  };
}

// 删除prompt
async function deletePrompt(index) {
  if (!confirm('Are you sure you want to delete this prompt?')) return;

  const result = await chrome.storage.local.get(STORAGE_KEY);
  const prompts = result[STORAGE_KEY] || [];
  prompts.splice(index, 1);
  
  await chrome.storage.local.set({ [STORAGE_KEY]: prompts });
  loadPrompts();
}

// 复制prompt到剪贴板
async function copyPrompt(index) {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const prompts = result[STORAGE_KEY] || [];
  const prompt = prompts[index];

  // 获取复制按钮元素
  const promptElement = document.querySelector(`.prompt-item:nth-child(${index + 1})`);
  const copyBtn = promptElement.querySelector('.copy-btn');
  const originalText = copyBtn.textContent;

  try {
    // 方法1: 使用 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(prompt.content);
      showCopySuccess(copyBtn, originalText);
      return;
    }

    // 方法2: 使用 execCommand
    const textarea = document.createElement('textarea');
    textarea.value = prompt.content;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const successful = document.execCommand('copy');
      if (successful) {
        showCopySuccess(copyBtn, originalText);
      } else {
        throw new Error('execCommand failed');
      }
    } finally {
      document.body.removeChild(textarea);
    }
  } catch (err) {
    console.error('Copy failed:', err);
    showCopyError(copyBtn, originalText);
  }
}

// 显示复制成功
function showCopySuccess(button, originalText) {
  button.textContent = 'Copied!';
  button.classList.add('success');
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove('success');
  }, 2000);
}

// 显示复制错误
function showCopyError(button, originalText) {
  button.textContent = 'Copy Failed';
  button.classList.add('error');
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove('error');
  }, 2000);
} 