// 同步头部标题和成员名
function syncHeaderTitle() {
    const memberName = document.getElementById('memberName').value;
    document.getElementById('headerTitle').value = memberName;
}

// 添加作品
function addWork() {
    const worksContainer = document.getElementById('worksContainer');
    const workCount = worksContainer.children.length;
    const newWorkId = workCount + 1;
    
    const workItem = document.createElement('div');
    workItem.className = 'work-item';
    workItem.id = `work${newWorkId}`;
    
    workItem.innerHTML = `
        <div class="form-group">
            <label for="workTitle${newWorkId}">作品标题:</label>
            <input type="text" id="workTitle${newWorkId}" placeholder="例如: 色彩的交响">
        </div>
        
        <div class="form-group">
            <label for="workDescription${newWorkId}">作品描述:</label>
            <input type="text" id="workDescription${newWorkId}" placeholder="例如: 2023年 | 油画 | 60x80cm">
        </div>
        
        <div class="media-options">
            <label>选择媒体类型:</label>
            <select class="media-type" onchange="toggleMediaOptions(${newWorkId})">
                <option value="image">图片</option>
                <option value="video">视频</option>
            </select>
        </div>
        
        <div class="image-container" id="imageContainer${newWorkId}">
            <div class="image-item">
                <div class="form-group">
                    <label for="imageTitle${newWorkId}-1">图片标题:</label>
                    <input type="text" id="imageTitle${newWorkId}-1" placeholder="例如: 图片1">
                </div>
                <div class="form-group">
                    <label for="imageUrl${newWorkId}-1">图片链接:</label>
                    <input type="text" id="imageUrl${newWorkId}-1" placeholder="例如: https://example.com/image1.jpg">
                </div>
            </div>
            <button type="button" onclick="addImage(${newWorkId})">添加图片</button>
        </div>
        
        <div class="video-container" id="videoContainer${newWorkId}" style="display: none;">
            <div class="video-item">
                <div class="form-group">
                    <label for="videoLink${newWorkId}-1">Bilibili视频链接:</label>
                    <input type="text" id="videoLink${newWorkId}-1" placeholder="例如: https://www.bilibili.com/video/BVXXXXXXXXXX">
                </div>
            </div>
            <button type="button" onclick="addVideo(${newWorkId})">添加视频</button>
        </div>
    `;
    
    worksContainer.appendChild(workItem);
}

// 切换媒体选项
function toggleMediaOptions(workId) {
    const mediaType = document.querySelector(`#work${workId} .media-type`).value;
    const imageContainer = document.getElementById(`imageContainer${workId}`);
    const videoContainer = document.getElementById(`videoContainer${workId}`);
    
    if (mediaType === 'image') {
        imageContainer.style.display = 'block';
        videoContainer.style.display = 'none';
    } else {
        imageContainer.style.display = 'none';
        videoContainer.style.display = 'block';
    }
}
// 添加图片
function addImage(workId) {
    const imageContainer = document.getElementById(`imageContainer${workId}`);
    const imageCount = imageContainer.querySelectorAll('.image-item').length;
    const newImageId = imageCount + 1;
    
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    
    imageItem.innerHTML = `
        <div class="form-group">
            <label for="imageTitle${workId}-${newImageId}">图片标题:</label>
            <input type="text" id="imageTitle${workId}-${newImageId}" placeholder="例如: 图片${newImageId}">
        </div>
        <div class="form-group">
            <label for="imageUrl${workId}-${newImageId}">图片链接:</label>
            <input type="text" id="imageUrl${workId}-${newImageId}" placeholder="例如: https://example.com/image${newImageId}.jpg">
        </div>
    `;
    
    imageContainer.appendChild(imageItem);
}

// 添加视频
function addVideo(workId) {
    const videoContainer = document.getElementById(`videoContainer${workId}`);
    const videoCount = videoContainer.querySelectorAll('.video-item').length;
    const newVideoId = videoCount + 1;
    
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    
    videoItem.innerHTML = `
        <div class="form-group">
            <label for="videoLink${workId}-${newVideoId}">Bilibili视频链接:</label>
            <input type="text" id="videoLink${workId}-${newVideoId}" placeholder="例如: https://www.bilibili.com/video/BVXXXXXXXXXX">
        </div>
    `;
    
    videoContainer.appendChild(videoItem);
}
// 生成HTML代码
function generateHTML() {
    // 获取头部信息
    const headerTitle = document.getElementById('headerTitle').value || '空';
    const headerSubtitle = document.getElementById('headerSubtitle').value || '吉祥物';
    
    // 获取成员信息
    const memberName = document.getElementById('memberName').value || '张三';
    const memberDescription = document.getElementById('memberDescription').value || '我是一名热爱艺术和设计的创作者...';
    const memberImage = document.getElementById('memberImage').value || 'https://source.unsplash.com/random/400x400/?portrait';
    
    // 获取页脚信息
    const footerContact = document.getElementById('footerContact').value || 'contact@example.com';
    
    // 获取所有作品
    const worksContainer = document.getElementById('worksContainer');
    const workItems = worksContainer.querySelectorAll('.work-item');
    
    let worksHTML = '';
    
    workItems.forEach((workItem, index) => {
        const workId = index + 1;
        const workTitle = workItem.querySelector(`#workTitle${workId}`).value || `作品 ${workId}`;
        const workDescription = workItem.querySelector(`#workDescription${workId}`).value || '2023年 | 作品类型 | 尺寸';
        
        const mediaType = workItem.querySelector(`#work${workId} .media-type`).value;
        let mediaHTML = '';
        
        if (mediaType === 'image') {
            const imageContainer = document.getElementById(`imageContainer${workId}`);
            const imageItems = imageContainer.querySelectorAll('.image-item');
            
            imageItems.forEach((imageItem, imgIndex) => {
                const imgId = imgIndex + 1;
                const imageTitle = imageItem.querySelector(`#imageTitle${workId}-${imgId}`).value || `图片 ${imgId}`;
                const imageUrl = imageItem.querySelector(`#imageUrl${workId}-${imgId}`).value || 'https://source.unsplash.com/random/600x400/?art';
                
                mediaHTML += `
                    <div class="work-media-item">
                        <img src="${imageUrl}" alt="${imageTitle}">
                        <p>${imageTitle}</p>
                    </div>
                `;
            });
        } else {
            const videoContainer = document.getElementById(`videoContainer${workId}`);
            const videoItems = videoContainer.querySelectorAll('.video-item');
            
            videoItems.forEach((videoItem, vidIndex) => {
                const vidId = vidIndex + 1;
                const videoLink = videoItem.querySelector(`#videoLink${workId}-${vidId}`).value;
                if (videoLink) {
                    const videoIdMatch = videoLink.match(/video\/(BV\w+)/);
                    if (videoIdMatch && videoIdMatch[1]) {
                        const videoId = videoIdMatch[1];
                        mediaHTML += `
                            <div class="video-item-container">
                                <iframe src="//player.bilibili.com/player.html?bvid=${videoId}" width="600" height="400" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
                            </div>
                        `;
                    }
                }
            });
        }
        
        worksHTML += `
            <div class="work-item animate">
                <h3>${workTitle}</h3>
                <p>${workDescription}</p>
                <div class="work-media-container">
                    ${mediaHTML}
                </div>
            </div>
        `;
    });
    
    // 生成完整的HTML代码
    const htmlCode = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>成员页</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>${headerTitle}</h1>
        <p>${headerSubtitle}</p>
    </header>
    
    <main>
        <!-- 返回按钮放置在关于我部分上方 -->
        <a href="../index.html" class="back-button">← 返回首页</a>
        
        <section>
            <h2>关于成员</h2>
            <div class="item animate">
                <img src="${memberImage}" alt="个人照片">
                <h3>${memberName}</h3>
                <p>${memberDescription}</p>
            </div>
        </section>
        
        <section>
            <h2>我的作品</h2>
            <div class="works-container">
                ${worksHTML}
            </div>
        </section>
    </main>
    
    <footer>
        <p>联系: <a href="mailto:${footerContact}">${footerContact}</a></p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
    `;
    
    // 显示生成的HTML代码
    document.getElementById('generatedHTML').textContent = htmlCode;
}

// 下载HTML文件
function downloadHTML() {
    const htmlCode = document.getElementById('generatedHTML').textContent;
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_page.html';
    a.click();
    URL.revokeObjectURL(url);
}