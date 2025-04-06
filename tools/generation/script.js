document.addEventListener('DOMContentLoaded', function () {
  const generateBtn = document.getElementById('generate-btn');
  const orderResult = document.getElementById('order-result');
  const orderDetails = document.getElementById('order-details');
  const copyBtn = document.getElementById('copy-btn');
  const saveJsonBtn = document.getElementById('save-json-btn');
  const saveImageBtn = document.getElementById('save-image-btn');
  const extractBtn = document.getElementById('extract-btn');
  const extractFileInput = document.getElementById('extract-file');
  const extractKeyInput = document.getElementById('extract-key');
  const extractResult = document.getElementById('extract-result');
  const orderTypeSelect = document.getElementById('order-type');
  const orderSubtypeSelect = document.getElementById('order-subtype');
  const subtypeContainer = document.getElementById('subtype-container');
  const artistIdInput = document.getElementById('artist-id');
  const artistIdError = document.getElementById('artist-id-error');
  const orderTimeInput = document.getElementById('order-time');
  const orderTimeError = document.getElementById('order-time-error');
  const deadlineTimeInput = document.getElementById('deadline-time');
  const deadlineTimeError = document.getElementById('deadline-time-error');
  const clientNameInput = document.getElementById('client-name');
  const businessDetailsInput = document.getElementById('business-details');
  const priceInput = document.getElementById('price');
  const commissionTypeSelect = document.getElementById('commission-type');
  const previewCanvas = document.getElementById('preview-canvas');
  const previewCtx = previewCanvas.getContext('2d');
  const loadingText = document.getElementById('loading');

  let orderTypes = {};
  let artists = [];
  let selectedArtist = null;
  let currentOrderInfo = null;

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

  // 使用加密密钥加密数据
  function encryptData(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  // 使用加密密钥解密数据
  function decryptData(encryptedData, key) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('解密失败: ', error);
      return null;
    }
  }

  // 绘制订单图片
  function drawOrderImage(orderInfo, key, canvas) {
    const ctx = canvas.getContext('2d');

    // 设置Canvas尺寸
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // 绘制蓝紫渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#e0e0ff'); // 浅蓝色
    gradient.addColorStop(1, '#f0f0f0'); // 浅灰色
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

    // 绘制装饰线（蓝紫渐变色）
    const lineGradient = ctx.createLinearGradient(50, 100, width - 50, 100);
    lineGradient.addColorStop(0, '#4169E1'); // 皇家蓝
    lineGradient.addColorStop(1, '#8A2BE2'); // 紫色
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(width - 50, 100);
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
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
    ctx.fillStyle = '#8A2BE2';
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
      { label: '截稿时间', value: formatDate(orderInfo.timeline.deadline) },
      { label: '单主名称', value: orderInfo.client.name },
      { label: '业务详情', value: orderInfo.business.details },
      { label: '价格', value: orderInfo.business.price },
      { label: '抽成类型', value: orderInfo.business.commissionType }
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
    ctx.strokeStyle = '#8A2BE2';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制图标
    ctx.font = '24px "Microsoft YaHei"';
    ctx.fillStyle = '#8A2BE2';
    ctx.fillText('⏰', 60, height - 60);

    // 将订单数据转换为二进制字符串并加密
    const orderData = JSON.stringify(orderInfo);
    const encryptedData = encryptData(orderData, key);
    const binaryData = textToBinary(encryptedData);

    // 在图片中嵌入隐写数据
    embedDataInImage(canvas, binaryData);

    return canvas;
  }

  // 将文本转换为二进制字符串
  function textToBinary(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  }

  // 在图片中嵌入隐写数据
  function embedDataInImage(canvas, binaryData) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 添加数据长度头部
    const dataLength = binaryData.length;
    const lengthBinary = dataLength.toString(2).padStart(32, '0'); // 32位长度头部
    const fullData = lengthBinary + binaryData;

    // 嵌入数据到像素的最低有效位
    for (let i = 0; i < fullData.length; i++) {
      if (i * 4 >= data.length) break; // 防止超出图像数据范围
      const bit = parseInt(fullData[i]);
      data[i * 4] = (data[i * 4] & 0xFE) | bit; // 修改红色通道的最低有效位
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // 从图片中提取隐写数据
  function extractDataFromImage(canvas, key) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

// 提取数据长度头部
    let lengthBinary = '';
    for (let i = 0; i < 32; i++) {
      if (i * 4 >= data.length) break;
      lengthBinary += (data[i * 4] & 1).toString();
    }
    const dataLength = parseInt(lengthBinary, 2);

    // 提取实际数据
    let binaryData = '';
    for (let i = 32; i < 32 + dataLength; i++) {
      if (i * 4 >= data.length) break;
      binaryData += (data[i * 4] & 1).toString();
    }

    // 将二进制数据转换为文本
    const extractedText = binaryToText(binaryData);
    const decryptedData = decryptData(extractedText, key);
    return decryptedData;
  }

  // 将二进制字符串转换为文本
  function binaryToText(binary) {
    const bytes = [];
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8);
      const charCode = parseInt(byte, 2);
      bytes.push(charCode);
    }
    return String.fromCharCode(...bytes);
  }

  // 格式化元数据，方便人类阅读
  function formatMetadata(orderInfo) {
    return `
订单唯一ID: ${orderInfo.orderId}
画师ID: ${orderInfo.artist.id}
画师昵称: ${orderInfo.artist.name}
订单类型: ${orderInfo.type} (${orderInfo.subtype})
下单时间: ${formatDate(orderInfo.timeline.orderTime)}
截稿时间: ${formatDate(orderInfo.timeline.deadline)}
单主名称: ${orderInfo.client.name}
业务详情: ${orderInfo.business.details}
价格: ${orderInfo.business.price}
抽成类型: ${orderInfo.business.commissionType}
    `;
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
    deadlineTimeError.textContent = '';

    // 获取表单数据
    const artistId = artistIdInput.value.trim();
    const orderType = orderTypeSelect.value;
    const orderSubtype = orderSubtypeSelect.value;
    const orderTime = orderTimeInput.value;
    const deadlineTime = deadlineTimeInput.value;
    const clientName = clientNameInput.value.trim();
    const businessDetails = businessDetailsInput.value.trim();
    const price = priceInput.value;
    const commissionType = commissionTypeSelect.value;

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
        deadline: deadlineTime
      },
      client: {
        name: clientName
      },
      business: {
        details: businessDetails,
        price: price,
        commissionType: commissionType
      },
      deadline: false, // 默认为false
      payment: false
    };

    currentOrderInfo = orderInfo;

    // 显示订单信息
    orderDetails.innerHTML = `
      <p><strong>订单唯一ID:</strong> ${orderInfo.orderId}</p>
      <p><strong>画师ID:</strong> ${orderInfo.artist.id}</p>
      <p><strong>画师昵称:</strong> ${orderInfo.artist.name}</p>
      <p><strong>订单类型:</strong> ${orderInfo.type} (${orderInfo.subtype})</p>
      <p><strong>下单时间:</strong> ${formatDate(orderInfo.timeline.orderTime)}</p>
      <p><strong>截稿时间:</strong> ${formatDate(orderInfo.timeline.deadline)}</p>
      <p><strong>单主名称:</strong> ${orderInfo.client.name}</p>
      <p><strong>业务详情:</strong> ${orderInfo.business.details}</p>
      <p><strong>价格:</strong> ${orderInfo.business.price}</p>
      <p><strong>抽成类型:</strong> ${orderInfo.business.commissionType}</p>
    `;

    // 显示结果区域
    orderResult.style.display = 'block';

    // 更新预览图
    const previewCanvas = drawOrderImage(orderInfo, orderId, document.getElementById('preview-canvas'));

    // 设置按钮事件
    copyBtn.onclick = function () {
      copyOrderId(orderInfo.orderId);
    };

    saveJsonBtn.onclick = function () {
      saveOrderJson(orderInfo);
    };

    saveImageBtn.onclick = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = drawOrderImage(orderInfo, orderId, canvas);
      const imgData = image.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `order_${orderInfo.orderId}.png`;
      link.href = imgData;
      link.click();
    };
  });

  // 解析图片中的隐写数据
  extractBtn.addEventListener('click', function () {
    const file = extractFileInput.files[0];
    const key = extractKeyInput.value.trim();

    if (!file) {
      alert('请选择图片文件');
      return;
    }

    if (!key) {
      alert('请输入密钥');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        try {
          const extractedData = extractDataFromImage(canvas, key);
          if (extractedData) {
            const orderInfo = JSON.parse(extractedData);
            extractResult.innerHTML = '<pre>' + formatMetadata(orderInfo) + '</pre>';
          } else {
            extractResult.textContent = '提取数据失败：数据无法解密，请检查密钥是否正确';
          }
        } catch (error) {
          extractResult.textContent = '提取数据失败：' + error.message;
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // 加载外部数据
  loadExternalData();
});