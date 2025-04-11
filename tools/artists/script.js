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
    </div>
    <button type="button" class="addMediaBtn">添加媒体</button>
    <button type="button" class="removeWorkBtn" style="background-color:#f44336;">删除作品</button>
    <hr>
  `;

  worksContainer.appendChild(workDiv);

  workDiv.querySelector('.addMediaBtn').addEventListener('click', function () {
    addMedia(workDiv);
  });

  workDiv.querySelector('.removeWorkBtn').addEventListener('click', function () {
    worksContainer.removeChild(workDiv);
  });
}

// 添加媒体项
function addMedia(workDiv) {
  const mediaContainer = workDiv.querySelector('.mediaContainer');
  const mediaDiv = document.createElement('div');
  mediaDiv.className = 'media-item';
  mediaDiv.innerHTML = `
    <input type="text" class="mediaLink" placeholder="输入图片 URL 或 Bilibili 嵌入链接">
    <button type="button" class="removeMediaBtn" style="background-color:#f44336;">移除</button>
  `;
  mediaContainer.appendChild(mediaDiv);

  mediaDiv.querySelector('.removeMediaBtn').addEventListener('click', function () {
    mediaContainer.removeChild(mediaDiv);
  });
}

// 更新预览内容，包括头部和作品列表
function updatePreview() {
  // 更新头部信息
  document.getElementById('previewHeader').textContent = document.getElementById('headerText').value;
  document.getElementById('previewMascot').textContent = document.getElementById('mascot').value;
  // 更新关于成员信息
  document.getElementById('previewMemberName').textContent = document.getElementById('memberName').value;
  document.getElementById('previewMemberDesc').textContent = document.getElementById('memberDesc').value;

  // 生成作品预览内容，结构和类名按照 000.html 示例生成
  const previewWorks = document.getElementById('previewWorks');
  previewWorks.innerHTML = '';

  const workEditors = document.querySelectorAll('.work-editor');
  workEditors.forEach(workEditor => {
    const workTitle = workEditor.querySelector('.workTitle').value;
    const workDetails = workEditor.querySelector('.workDetails').value;

    // 使用与示例相同的结构和类名
    const workItem = document.createElement('div');
    workItem.className = 'work-item animate';

    const h3 = document.createElement('h3');
    h3.textContent = workTitle;
    workItem.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = workDetails;
    workItem.appendChild(p);

    // 媒体内容容器
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'work-media-container';

    // 生成媒体项目，统一放入 work-media-container 中
    const mediaLinks = workEditor.querySelectorAll('.mediaLink');
    mediaLinks.forEach(mediaInput => {
      const link = mediaInput.value.trim();
      if (link) {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'work-media-item';
        if (link.indexOf('bilibili') !== -1) {
          const iframe = document.createElement('iframe');
          iframe.src = link;
          iframe.width = "560";
          iframe.height = "315";
          iframe.frameBorder = "0";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          mediaItem.appendChild(iframe);
        } else {
          const img = document.createElement('img');
          img.src = link;
          img.alt = workTitle;
          mediaItem.appendChild(img);
        }
        mediaContainer.appendChild(mediaItem);
      }
    });

    workItem.appendChild(mediaContainer);
    previewWorks.appendChild(workItem);
  });
}

// 下载 ZIP 包含生成的 HTML 文件及每个作品对应的 JSON 数据
async function downloadHTML() {
  const zip = new JSZip();

  // 根据页面预览生成符合 000.html 结构的完整 HTML 字符串
  const titleText = "成员页"; // 固定标题，也可根据需要动态设置
  const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleText}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1 id="previewHeader">${document.getElementById('previewHeader').textContent || "空"}</h1>
    <p id="previewMascot">${document.getElementById('previewMascot').textContent || "吉祥物"}</p>
  </header>
  <main>
    <a href="../index.html" class="back-button">← 返回首页</a>
    <section>
      <h2>关于成员</h2>
      <div class="item animate">
        <img src="https://source.unsplash.com/random/400x400/?portrait" alt="个人照片" style="width: 150px; height: 150px; border-radius: 50%; margin-bottom: 15px;">
        <h3 id="previewMemberName">${document.getElementById('previewMemberName').textContent || "张三"}</h3>
        <p id="previewMemberDesc">${document.getElementById('previewMemberDesc').textContent || "我是一名热爱艺术和设计的创作者，专注于数字艺术、平面设计和摄影。我的作品融合了传统技法与现代技术，致力于创造既有视觉冲击力又富有内涵的艺术表达。"}</p>
        <p>通过这个网站，我希望能够分享我的创作历程，展示我的作品，并与志同道合的艺术家和爱好者交流。</p>
      </div>
    </section>
    <section>
      <h2>我的作品</h2>
      <div class="works-container" id="previewWorks">
        ${document.getElementById('previewWorks').innerHTML}
      </div>
    </section>
  </main>
  <footer>
    <p>联系: <a href="mailto:contact@example.com">contact@example.com</a></p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;

  zip.file("generated.html", fullHTML);

  // 对于每个作品，生成对应 JSON 文件
  const workEditors = document.querySelectorAll('.work-editor');
  workEditors.forEach((workEditor, index) => {
    const title = workEditor.querySelector('.workTitle').value;
    const description = workEditor.querySelector('.workDetails').value;
    const mediaInputs = workEditor.querySelectorAll('.mediaLink');
    const media = [];
    mediaInputs.forEach(input => {
      const src = input.value.trim();
      if (src) {
        media.push({
          type: src.includes("bilibili") ? "video" : "image",
          src,
          alt: title
        });
      }
    });
    const jsonData = {
      title,
      description,
      media
    };
    zip.file(`work_${index + 1}.json`, JSON.stringify(jsonData, null, 2));
  });

  // 打包并下载 ZIP 文件
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "portfolio.zip";
  a.click();
  URL.revokeObjectURL(a.href);
}