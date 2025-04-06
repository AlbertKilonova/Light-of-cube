document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('htmlGenerator');
    const addWorkBtn = document.getElementById('addWork');
    const worksContainer = document.getElementById('worksContainer');
    const previewContent = document.getElementById('previewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // 添加作品
    addWorkBtn.addEventListener('click', function() {
        const workItem = document.createElement('div');
        workItem.className = 'work-item';
        workItem.innerHTML = `
            <input type="text" class="workTitle" placeholder="作品标题">
            <textarea class="workDescription" placeholder="作品描述..."></textarea>
            <input type="url" class="workImage" placeholder="作品图片URL">
            <button type="button" class="btn btn-danger remove-work">删除</button>
        `;
        worksContainer.appendChild(workItem);
        
        // 添加删除按钮事件
        const removeBtn = workItem.querySelector('.remove-work');
        removeBtn.addEventListener('click', function() {
            workItem.remove();
        });
    });
    
    // 初始化删除按钮
    document.querySelectorAll('.remove-work').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.work-item').remove();
        });
    });
    
    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const headerTitle = document.getElementById('headerTitle').value;
        const headerSubtitle = document.getElementById('headerSubtitle').value;
        const memberName = document.getElementById('memberName').value;
        const memberImage = document.getElementById('memberImage').value;
        const memberDescription = document.getElementById('memberDescription').value;
        const footerContact = document.getElementById('footerContact').value;
        
        // 获取作品数据
        const workItems = [];
        document.querySelectorAll('.work-item').forEach(item => {
            const title = item.querySelector('.workTitle').value;
            const description = item.querySelector('.workDescription').value;
            const image = item.querySelector('.workImage').value;
            
            if (title || description || image) {
                workItems.push({
                    title,
                    description,
                    image
                });
            }
        });
        
        // 生成作品HTML
        let worksHTML = '';
        workItems.forEach(work => {
            worksHTML += `
                <div class="work-item">
                    ${work.image ? `<img src="${work.image}" alt="${work.title}">` : ''}
                    <h3>${work.title}</h3>
                    <p>${work.description}</p>
                </div>
            `;
        });
        
        // 生成完整HTML
        const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${memberName} - 成员页</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>${headerTitle}</h1>
        <p>${headerSubtitle}</p>
    </header>
    
    <main>
        <a href="../index.html" class="back-button">← 返回首页</a>
        
        <section>
            <h2>关于成员</h2>
            <div class="item">
                <img src="${memberImage}" alt="${memberName}">
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
        
        // 显示预览
        previewContent.textContent = htmlContent;
        
        // 启用下载按钮
        downloadBtn.disabled = false;
        
        // 设置下载功能
        downloadBtn.onclick = function() {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${memberName}-成员页.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    });
});