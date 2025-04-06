document.addEventListener('DOMContentLoaded', function () {
  const generateBtn = document.getElementById('generate-btn');
  const orderResult = document.getElementById('order-result');
  const orderDetails = document.getElementById('order-details');
  const copyBtn = document.getElementById('copy-btn');
  const saveJsonBtn = document.getElementById('save-json-btn');
  const saveImageBtn = document.getElementById('save-image-btn');
  const orderTypeSelect = document.getElementById('order-type');
  const orderSubtypeSelect = document.getElementById('order-subtype');
  const subtypeContainer = document.getElementById('subtype-container');
  const artistIdInput = document.getElementById('artist-id');
  const artistIdError = document.getElementById('artist-id-error');
  const orderTimeInput = document.getElementById('order-time');
  const orderTimeError = document.getElementById('order-time-error');
  const scheduledTimeInput = document.getElementById('scheduled-time');
  const scheduledTimeError = document.getElementById('scheduled-time-error');
  const deadlineTimeInput = document.getElementById('deadline-time');
  const deadlineTimeError = document.getElementById('deadline-time-error');
  const loadingText = document.getElementById('loading');

  let orderTypes = {};
  let artists = [];
  let selectedArtist = null;

  // 生成随机哈希值
  function generateHash(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    for (let i = 0; i < length; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  // 生成订单ID
  function generateOrderId(orderType, artistId) {
    const studioCode = 'GL'; // 光之立方缩写
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const timestamp = Date.now().toString().slice(-6); // 取时间戳的后6位
    const hash = generateHash(6);
    const typeCode = orderTypes[orderType] && orderTypes[orderType].code ? orderTypes[orderType].code : 'XX';

    return `${studioCode}-${typeCode}-${formattedDate}-${timestamp}-${artistId}-${hash}`;
  }

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '无效日期';
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // 验证画师ID（必须是三位数字字符串）
  function validateArtistId(artistId) {
    const regex = /^\d{3}$/;
    return regex.test(artistId);
  }

  // 根据画师ID查找画师信息（转换 artist.id 为字符串进行比较）
  function findArtistById(artistId) {
    return artists.find(artist => String(artist.id) === artistId);
  }

  // 复制订单ID到剪贴板
  function copyOrderId(orderId) {
    navigator.clipboard.writeText(orderId)
      .then(() => {
        alert('订单ID已复制到剪贴板！');
      })
      .catch(err => {
        console.error('无法复制: ', err);
        alert('复制失败，请手动复制订单ID');
      });
  }

  // 保存订单JSON
  function saveOrderJson(orderInfo) {
    const dataStr = JSON.stringify(orderInfo, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `order_${orderInfo.orderId}.json`);
  }

  // 辅助函数：绘制圆角矩形
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // 保存订单图片
  function saveOrderImage(orderInfo) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置Canvas尺寸
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f0f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 绘制标题（添加阴影效果）
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.font = 'bold 32px "Microsoft YaHei"';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('光之立方画社订单信息', width / 2, 80);
    ctx.shadowBlur = 0; // 重置阴影

    // 绘制装饰线
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(width - 50, 100);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制订单信息区域（使用圆角矩形和渐变）
    const tableX = 50;
    const tableY = 120;
    const tableWidth = width - 100;
    const tableHeight = 400;
    const radius = 10;

    // 外框阴影
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 8;
    roundRect(ctx, tableX, tableY, tableWidth, tableHeight, radius);
    ctx.fillStyle = '#4CAF50';
    ctx.fill();
    ctx.restore();

    // 内部背景
    roundRect(ctx, tableX + 10, tableY + 10, tableWidth - 20, tableHeight - 20, radius);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // 绘制边框
    roundRect(ctx, tableX + 10, tableY + 10, tableWidth - 20, tableHeight - 20, radius);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 绘制表格标题
    ctx.font = 'bold 20px "Microsoft YaHei"';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('订单详情', tableX + 30, tableY + 30);

    // 绘制表格内容
    ctx.font = '16px "Microsoft YaHei"';
    ctx.fillStyle = '#333';

    let y = tableY + 60;
    const tableRows = [
      { label: '订单唯一ID', value: orderInfo.orderId },
      { label: '画师ID', value: orderInfo.artist.id },
      { label: '画师昵称', value: orderInfo.artist.name },
      { label: '订单类型', value: `${orderInfo.type} (${orderInfo.subtype})` },
      { label: '下单时间', value: formatDate(orderInfo.timeline.orderTime) },
      { label: '预计排到时间', value: formatDate(orderInfo.timeline.scheduled) },
      { label: '截稿时间', value: formatDate(orderInfo.timeline.deadline) }
    ];

    tableRows.forEach(row => {
      ctx.fillText(`${row.label}:`, tableX + 30, y);
      ctx.fillText(row.value, tableX + 250, y);
      y += 35;
    });

    // 绘制分隔线（在每行之间绘制细线）
    y = tableY + 50;
    ctx.strokeStyle = '#eee';
    for (let i = 0; i < tableRows.length + 1; i++) {
      const lineY = y + i * 35;
      ctx.beginPath();
      ctx.moveTo(tableX + 10, lineY);
      ctx.lineTo(tableX + tableWidth - 10, lineY);
      ctx.stroke();
    }

    // 底部装饰：绘制平滑曲线
    ctx.beginPath();
    ctx.moveTo(50, height - 100);
    ctx.quadraticCurveTo(width / 2, height - 50, width - 50, height - 100);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制图标及生成时间
    ctx.font = '24px "Microsoft YaHei"';
    ctx.fillStyle = '#4CAF50';
    ctx.fillText('⏰', 60, height - 60);
    ctx.font = '14px "Microsoft YaHei"';
    ctx.fillStyle = '#666';
    ctx.fillText('生成时间: ' + new Date().toLocaleString(), 100, height - 55);

    // 将Canvas内容转换为图片并自动下载
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `order_${orderInfo.orderId}.png`;
    link.href = image;
    link.click();
  }

  // 从外部JSON加载数据
  async function loadExternalData() {
    try {
      // 加载订单类型
      const orderTypesResponse = await fetch('order-types.json');
      if (!orderTypesResponse.ok) {
        throw new Error('无法加载订单类型数据');
      }
      orderTypes = await orderTypesResponse.json();

      // 加载画师信息
      const artistsResponse = await fetch('artists.json');
      if (!artistsResponse.ok) {
        throw new Error('无法加载画师信息');
      }
      artists = await artistsResponse.json();

      // 填充订单类型下拉菜单
      orderTypeSelect.innerHTML = '';
      for (const type in orderTypes) {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        orderTypeSelect.appendChild(option);
      }

      // 启用下拉菜单和按钮
      orderTypeSelect.disabled = false;
      generateBtn.disabled = false;

      // 隐藏加载提示
      loadingText.style.display = 'none';
    } catch (error) {
      console.error(error);
      orderTypeSelect.innerHTML = '<option value="">加载失败，请刷新页面</option>';
      loadingText.textContent = '加载数据失败，请检查网络连接';
    }
  }

  // 处理订单类型变化
  orderTypeSelect.addEventListener('change', function () {
    const selectedType = this.value;
    if (selectedType) {
      // 填充子类型下拉菜单
      subtypeContainer.style.display = 'block';
      orderSubtypeSelect.disabled = false;

      orderSubtypeSelect.innerHTML = '';
      orderTypes[selectedType].subtypes.forEach(subtype => {
        const option = document.createElement('option');
        option.value = subtype;
        option.textContent = subtype;
        orderSubtypeSelect.appendChild(option);
      });
    } else {
      subtypeContainer.style.display = 'none';
      orderSubtypeSelect.disabled = true;
    }
  });

  // 生成订单
  generateBtn.addEventListener('click', function () {
    // 重置错误信息
    artistIdError.textContent = '';
    orderTimeError.textContent = '';
    scheduledTimeError.textContent = '';
    deadlineTimeError.textContent = '';

    // 获取表单数据
    const artistId = artistIdInput.value.trim();
    const orderType = orderTypeSelect.value;
    const orderSubtype = orderSubtypeSelect.value;
    const orderTime = orderTimeInput.value;
    const scheduledTime = scheduledTimeInput.value;
    const deadlineTime = deadlineTimeInput.value;

    // 验证画师ID
    if (!validateArtistId(artistId)) {
      artistIdError.textContent = '画师ID必须是三位整数';
      return;
    }

    selectedArtist = findArtistById(artistId);
    if (!selectedArtist) {
      artistIdError.textContent = '未找到匹配的画师ID，请检查输入';
      return;
    }

    // 验证订单类型和子类型
    if (!orderType || !orderSubtype) {
      alert('请选择订单类型和子类型');
      return;
    }

    // 验证时间输入
    if (!orderTime) {
      orderTimeError.textContent = '请选择下单时间';
      return;
    }
    if (!scheduledTime) {
      scheduledTimeError.textContent = '请选择预计排到时间';
      return;
    }
    if (!deadlineTime) {
      deadlineTimeError.textContent = '请选择截稿时间';
      return;
    }

    // 生成订单ID
    const orderId = generateOrderId(orderType, artistId);

    // 生成订单详情
    const orderInfo = {
      orderId: orderId,
      artist: {
        id: selectedArtist.id,
        name: selectedArtist.name
      },
      type: orderType,
      subtype: orderSubtype,
      timeline: {
        orderTime: orderTime,
        scheduled: scheduledTime,
        deadline: deadlineTime
      },
      completed: false // 默认为false
    };

    // 显示订单信息
    orderDetails.innerHTML = `
      <p><strong>订单唯一ID:</strong> ${orderInfo.orderId}</p>
      <p><strong>画师ID:</strong> ${orderInfo.artist.id}</p>
      <p><strong>画师昵称:</strong> ${orderInfo.artist.name}</p>
      <p><strong>订单类型:</strong> ${orderInfo.type} (${orderInfo.subtype})</p>
      <p><strong>下单时间:</strong> ${formatDate(orderInfo.timeline.orderTime)}</p>
      <p><strong>预计排到时间:</strong> ${formatDate(orderInfo.timeline.scheduled)}</p>
      <p><strong>截稿时间:</strong> ${formatDate(orderInfo.timeline.deadline)}</p>
    `;

    // 显示结果区域
    orderResult.style.display = 'block';

    // 设置按钮事件
    copyBtn.onclick = function () {
      copyOrderId(orderInfo.orderId);
    };

    saveJsonBtn.onclick = function () {
      saveOrderJson(orderInfo);
    };

    saveImageBtn.onclick = function () {
      saveOrderImage(orderInfo);
    };
  });

  // 加载外部数据
  loadExternalData();
});