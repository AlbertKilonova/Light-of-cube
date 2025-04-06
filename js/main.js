document.addEventListener("DOMContentLoaded", function () {
  loadCarousel();
  loadWorks();
  loadArtists();
});

// 加载轮播作品数据并生成轮播效果
function loadCarousel() {
  fetch("data/carousel.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("carouselContainer");
      data.forEach((item, i) => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        // 设置入场动画与时差 delay
        slide.classList.add("animate");
        slide.style.animationDelay = `${i * 0.3}s`;
        slide.innerHTML = `
          <img src="${item.image}" alt="${item.title}" />
          <p>${item.title}</p>
        `;
        container.appendChild(slide);
      });
      // 默认显示第一张
      const slides = document.querySelectorAll(".carousel-slide");
      if (slides.length > 0) {
        slides[0].classList.add("active");
      }
      // 简单自动切换轮播
      let index = 0;
      setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
      }, 3000);
    })
    .catch(error => {
      console.error("加载轮播数据失败：", error);
      document.getElementById("carouselContainer").innerText = "轮播数据加载失败。";
    });
}

// 加载作品数据并生成展示项，支持图片和视频（Bilibili 嵌入）
function loadWorks() {
  fetch("data/works.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("worksContainer");
      container.innerHTML = ""; // 清空容器

      // 检查作品数量，决定是否启用横向滚动
      if (data.length > 1) {
        container.classList.remove("single-work");
        container.classList.add("horizontal-scroll");
      } else {
        container.classList.remove("horizontal-scroll");
        container.classList.add("single-work");
      }

      data.forEach((work, i) => {
        const item = document.createElement("div");
        item.className = "work-item";
        // 添加入场动画与时差
        item.classList.add("animate");
        item.style.animationDelay = `${i * 0.2}s`;

        // 创建横向滚动容器
        const mediaContainer = document.createElement("div");
        mediaContainer.className = "work-media-container";

        // 处理多张图片或视频
        work.media.forEach((media, j) => {
          const mediaItem = document.createElement("div");
          mediaItem.className = "work-media-item";
          mediaItem.classList.add("animate");
          mediaItem.style.animationDelay = `${j * 0.1}s`;

          let mediaContent = "";
          if (media.type === "image") {
            mediaContent = `<img src="${media.src}" alt="${media.alt || work.title}"/>`;
          } else if (media.type === "video") {
            mediaContent = `<iframe src="${media.src}" frameborder="0" allowfullscreen></iframe>`;
          }

          mediaItem.innerHTML = mediaContent;
          mediaContainer.appendChild(mediaItem);
        });

        item.innerHTML = `
          <h3>${work.title}</h3>
          <p>${work.description}</p>
        `;

        // 将横向滚动容器添加到作品项中
        item.insertBefore(mediaContainer, item.firstChild);

        container.appendChild(item);
      });
    })
    .catch(error => {
      console.error("加载作品数据失败：", error);
      document.getElementById("worksContainer").innerText = "作品数据加载失败。";
    });
}


// 加载艺术家数据并生成艺术家列表，点击卡片跳转到对应详情页
function loadArtists() {
  fetch("data/artists.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("artistList");
      data.forEach((artist, i) => {
        const item = document.createElement("li");
        item.className = "artist-item";
        // 添加入场动画与时差效果
        item.classList.add("animate");
        item.style.animationDelay = `${i * 0.2}s`;

        // 创建链接，点击后跳转到对应 artist.id 的 HTML 文件（例如 artists/007.html）
        const link = document.createElement("a");
        link.href = `artists/${artist.id}.html`;
        // 移除默认链接样式
        link.style.textDecoration = "none";
        link.style.color = "inherit";
        link.innerHTML = `
          <h3>${artist.name}</h3>
          <p>职位：${artist.position}</p>
          <p>擅长：${artist.allowedTypes.join("、") || "无"}</p>
        `;
        item.appendChild(link);
        container.appendChild(item);
      });
    })
    .catch(error => {
      console.error("加载成员数据失败：", error);
      document.getElementById("artistList").innerText = "成员数据加载失败。";
    });
}