let orders = [];

// 加载同级目录下的 JSON 文件
fetch('orders.json')
  .then(res => res.json())
  .then(data => {
    orders = Array.isArray(data) ? data : [data];
  })
  .catch(err => {
    alert('加载数据失败，请确保文件存在并使用本地服务器访问。');
    console.error(err);
  });

function queryOrder() {
  const inputId = document.getElementById('orderId').value.trim();
  const resultBox = document.getElementById('resultBox');
  resultBox.style.display = 'block';

  if (!inputId) {
    resultBox.innerHTML = '<p>请输入订单ID</p>';
    return;
  }

  const found = orders.find(o => o.orderId === inputId);

  if (!found) {
    resultBox.innerHTML = `<p>未找到订单 ID 为 <strong>${inputId}</strong> 的订单。</p>`;
    return;
  }

// 判断是否超时并计算超时时间
  let overdueHTML = '';
  if (found.timeline?.deadline) {
    // 如果 deadline 为 true，则不计算超时
    if (!found.deadline) {
      const now = new Date();
      const deadline = new Date(found.timeline.deadline);
      const isOverdue = now > deadline;

      if (isOverdue) {
        const diffMs = now - deadline;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        overdueHTML = `
          <p><strong>超时状态：</strong> <span class="overdue">已超时</span></p>
          <p><strong>超时时间：</strong> ${diffDays}天 ${diffHours}小时 ${diffMinutes}分钟</p>
        `;
      } else {
        overdueHTML = `<p><strong>超时状态：</strong> <span class="on-time">未超时</span></p>`;
      }
    }
  }

  // 客户信息
  const clientHTML = found.client ? `
    <div class="section">
      <div class="section-title">单主信息</div>
      <p><strong>单主名称：</strong>${found.client.name}</p>
    </div>
  ` : '';

  // 业务信息
  const businessHTML = found.business ? `
    <div class="section">
      <div class="section-title">详细信息</div>
      <p><strong>详情：</strong>${found.business.details}</p>
      <p><strong>价格：</strong>${found.business.price}</p>
      <p><strong>分成类型：</strong>${found.business.commissionType}</p>
    </div>
  ` : '';

  // 截止日期状态和支付状态
  const statusHTML = `
    <div class="section">
      <div class="section-title">状态信息</div>
      <p><strong>截稿状态：</strong>${found.deadline ? '是' : '否'}</p>
      <p><strong>付款状态：</strong>${found.payment ? '已支付' : '未支付'}</p>
    </div>
  `;

  // 订单完成状态
  const completedHTML = found.payment && found.deadline ? `
    <p><strong>完成状态：</strong>已完成</p>
  ` : `
    <p><strong>完成状态：</strong>未完成</p>
  `;

  resultBox.innerHTML = `
    <div class="section">
      <div class="section-title">订单基本信息</div>
      <h3>订单 ID：${found.orderId}</h3>
      <p><strong>画师：</strong>${found.artist?.name}（ID: ${found.artist?.id}）</p>
      <p><strong>类型：</strong>${found.type} - ${found.subtype}</p>
      <p><strong>下单时间：</strong>${found.timeline?.orderTime}</p>
      <p><strong>截止时间：</strong>${found.timeline?.deadline}</p>
      ${overdueHTML}
      ${completedHTML}
    </div>
    <hr>
    ${clientHTML}
    <hr>
    ${businessHTML}
    <hr>
    ${statusHTML}
  `;
}