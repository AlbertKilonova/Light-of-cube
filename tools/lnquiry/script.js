let orders = [];

// 加载同级目录下的 JSON 文件
fetch('orders.json')
  .then(res => res.json())
  .then(data => {
    orders = Array.isArray(data) ? data : [data];
  })
  .catch(err => {
    alert('加载 orders.json 失败，请确保文件存在并使用本地服务器访问。');
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

  // 判断是否超时（只对未完成订单判断）
  let overdueHTML = '';
  if (!found.completed && found.timeline?.deadline) {
    const now = new Date();
    const deadline = new Date(found.timeline.deadline);
    const isOverdue = now > deadline;

    overdueHTML = `<p><strong>是否超时：</strong> <span class="${isOverdue ? 'overdue' : 'on-time'}">
      ${isOverdue ? '已超时' : '未超时'}
    </span></p>`;
  }

  // 客户信息
  const clientHTML = found.client ? `
    <div class="section">
      <div class="section-title">客户信息</div>
      <p><strong>客户名称：</strong>${found.client.name}</p>
    </div>
  ` : '';

  // 业务信息
  const businessHTML = found.business ? `
    <div class="section">
      <div class="section-title">业务信息</div>
      <p><strong>详情：</strong>${found.business.details}</p>
      <p><strong>价格：</strong>${found.business.price}</p>
      <p><strong>分成类型：</strong>${found.business.commissionType}</p>
    </div>
  ` : '';

  // 截止日期和支付状态
  const deadlineStatusHTML = `
    <div class="section">
      <div class="section-title">状态信息</div>
      <p><strong>截止日期状态：</strong>${found.deadline ? '是' : '否'}</p>
      <p><strong>支付状态：</strong>${found.payment ? '已支付' : '未支付'}</p>
    </div>
  `;

  resultBox.innerHTML = `
    <div class="section">
      <div class="section-title">订单基本信息</div>
      <h3>订单 ID：${found.orderId}</h3>
      <p><strong>画师：</strong>${found.artist?.name}（ID: ${found.artist?.id}）</p>
      <p><strong>类型：</strong>${found.type} - ${found.subtype}</p>
      <p><strong>下单时间：</strong>${found.timeline?.orderTime}</p>
      <p><strong>排期时间：</strong>${found.timeline?.scheduled}</p>
      <p><strong>截止时间：</strong>${found.timeline?.deadline}</p>
      <p><strong>完成状态：</strong>${found.completed ? '已完成' : '未完成'}</p>
      ${overdueHTML}
    </div>
    ${clientHTML}
    ${businessHTML}
    ${deadlineStatusHTML}
  `;
}