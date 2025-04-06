document.addEventListener("DOMContentLoaded", function() {
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
        // 设置入场动画及时差 delay
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
      data.forEach((work, i) => {
        const item = document.createElement("div");
        item.className = "work-item";
        // 添加入场动画与时差
        item.classList.add("animate");
        item.style.animationDelay = `${i * 0.2}s`;
        let media = "";
        if (work.type === "image") {
          media = `<img src="${work.src}" alt="${work.title}"/>`;
        } else if (work.type === "video") {
          media = `<iframe src="${work.src}" frameborder="0" allowfullscreen></iframe>`;
        }
        item.innerHTML = `
          ${media}
          <h3>${work.title}</h3>
          <p>${work.description}</p>
        `;
        container.appendChild(item);
      });
    })
    .catch(error => {
      console.error("加载作品数据失败：", error);
      document.getElementById("worksContainer").innerText = "作品数据加载失败。";
    });
}

// 加载艺术家数据并生成艺术家列表
function loadArtists() {
  fetch("data/artists.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("artistList");
      data.forEach((artist, i) => {
        const item = document.createElement("li");
        item.className = "artist-item";
        // 添加入场动画及时差效果
        item.classList.add("animate");
        item.style.animationDelay = `${i * 0.2}s`;
        item.innerHTML = `
          <h3>${artist.name}</h3>
          <p>职位：${artist.position}</p>
          <p>擅长：${artist.allowedTypes.join("、") || "无"}</p>
        `;
        container.appendChild(item);
      });
    })
    .catch(error => {
      console.error("加载艺术家数据失败：", error);
      document.getElementById("artistList").innerText = "艺术家数据加载失败。";
    });
}