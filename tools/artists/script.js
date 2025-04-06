let workCount = 0;
document.getElementById('addWorkBtn').addEventListener('click', addWork);

// 添加一个作品编辑块
function addWork() {
  workCount++;
  const worksContainer = document.getElementById('worksContainer');
  
  const workDiv = document.createElement('div');
  workDiv.className = 'work-editor';
  workDiv.setAttribute('data-work-index', workCount);
  
  workDiv.innerHTML = `
    <h4>作品 ${workCount}</h4>
    <div>
      <label>作品标题：</label>
      <input type="text" class="workTitle" placeholder="作品标题" value="作品标题 ${workCount}">
    </div>
    <div>
      <label>作品详情：</label>
      <input type="text" class="workDetails" placeholder="作品详情" value="详情 ${workCount}">
    </div>
    <div class="mediaContainer">
      <h5>媒体内容</h5>
      <!-- 媒体项将添加在这里 -->
    </div>
    <button type="button" class="addMediaBtn">添加媒体</button>
    <button type="button" class="removeWorkBtn" style="background-color:#f44336;">删除作品</button>
    <hr>
  `;
  
  worksContainer.appendChild(workDiv);
  
  // 绑定“添加媒体”按钮事件
  workDiv.querySelector('.addMediaBtn').addEventListener('click', function() {
    addMedia(workDiv);
  });
  
  // 绑定“删除作品”按钮事件
  workDiv.querySelector('.removeWorkBtn').addEventListener('click', function() {
    worksContainer.removeChild(workDiv);
  });
}

// 为指定作品添加媒体项
function addMedia(workDiv) {
  const mediaContainer = workDiv.querySelector('.mediaContainer');
  const mediaDiv = document.createElement('div');
  mediaDiv.className = 'media-item';
  mediaDiv.innerHTML = `
    <input type="text" class="mediaLink" placeholder="输入图片 URL 或 Bilibili 嵌入链接">
    <button type="button" class="removeMediaBtn" style="background-color:#f44336;">移除</button>
  `;
  mediaContainer.appendChild(mediaDiv);
  
  // 绑定移除媒体项事件
  mediaDiv.querySelector('.removeMediaBtn').addEventListener('click', function() {
    mediaContainer.removeChild(mediaDiv);
  });
}

// 根据编辑器数据更新预览区内容
function updatePreview() {
  // 更新 header 和成员信息
  document.getElementById('previewHeader').textContent = document.getElementById('headerText').value;
  document.getElementById('previewMascot').textContent = document.getElementById('mascot').value;
  document.getElementById('previewMemberName').textContent = document.getElementById('memberName').value;
  document.getElementById('previewMemberDesc').textContent = document.getElementById('memberDesc').value;
  
  // 清空原有作品预览
  const previewWorks = document.getElementById('previewWorks');
  previewWorks.innerHTML = '';
  
  // 遍历每个作品编辑块，生成预览内容
  const workEditors = document.querySelectorAll('.work-editor');
  workEditors.forEach(workEditor => {
    const workTitle = workEditor.querySelector('.workTitle').value;
    const workDetails = workEditor.querySelector('.workDetails').value;
    
    const workPreviewDiv = document.createElement('div');
    workPreviewDiv.className = 'work-preview';
    
    const h3 = document.createElement('h3');
    h3.textContent = workTitle;
    workPreviewDiv.appendChild(h3);
    
    const p = document.createElement('p');
    p.textContent = workDetails;
    workPreviewDiv.appendChild(p);
    
    // 遍历当前作品中的所有媒体链接
    const mediaLinks = workEditor.querySelectorAll('.mediaLink');
    mediaLinks.forEach(mediaInput => {
      const link = mediaInput.value.trim();
      if (link) {
        const mediaPreviewDiv = document.createElement('div');
        mediaPreviewDiv.className = 'media-preview';
        // 如果链接中含有 "bilibili"，则以 iframe 嵌入视频，否则显示图片
        if (link.indexOf('bilibili') !== -1) {
          const iframe = document.createElement('iframe');
          iframe.src = link;
          iframe.width = "560";
          iframe.height = "315";
          iframe.frameBorder = "0";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          mediaPreviewDiv.appendChild(iframe);
        } else {
          const img = document.createElement('img');
          img.src = link;
          img.alt = workTitle;
          mediaPreviewDiv.appendChild(img);
        }
        workPreviewDiv.appendChild(mediaPreviewDiv);
      }
    });
    
    previewWorks.appendChild(workPreviewDiv);
  });
}

// 根据预览区内容生成完整 HTML 并下载到本地
// 注意：下载后的 HTML 文件不包含预览时使用的样式文件
function downloadHTML() {
  const previewContent = document.getElementById('previewContent').innerHTML;
  const title = document.getElementById('previewHeader').textContent || "生成页面";
  const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${previewContent}
<script src="script.js"></script>
</body>
</html>`;
  const blob = new Blob([fullHTML], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'generated.html';
  a.click();
  URL.revokeObjectURL(a.href);
}