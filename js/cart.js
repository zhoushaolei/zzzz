// 页面加载完成后初始化购物车
document.addEventListener('DOMContentLoaded', function() {
    // 渲染购物车商品
    renderCartItems();
    
    // 更新购物车总计
    updateCartSummary();
    
    // 绑定全选事件
    bindSelectAllEvent();
    
    // 绑定批量删除事件
    bindBatchRemoveEvent();
    
    // 绑定清空购物车事件
    bindClearCartEvent();
    
    // 监听购物车更新事件
    window.addEventListener('cartUpdated', function() {
        renderCartItems();
        updateCartSummary();
    });
});

// 渲染购物车商品（适配SVG图片）
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartItems = getCartItems();
    
    // 定义商品SVG颜色映射表
    const colorMap = {
        'svg-mobile': '#457b9d',
        'svg-headset': '#e63946',
        'svg-watch': '#1d3557',
        'svg-laptop': '#6c757d',
        'svg-speaker': '#2a9d8f',
        'svg-ssd': '#e9c46a',
        'svg-powerbank': '#f4a261',
        'svg-charger': '#e76f51'
    };

    // 如果购物车为空
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>您的购物车是空的</h3>
                <p>快去挑选心仪的商品吧！</p>
                <a href="products.html" class="btn btn-primary">去购物</a>
            </div>
        `;
        
        // 隐藏结算按钮
        document.getElementById('checkout-btn').style.display = 'none';
        return;
    }
    
    // 显示结算按钮
    document.getElementById('checkout-btn').style.display = 'inline-block';
    
    // 生成购物车表格
    let cartHtml = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="select-all"></th>
                    <th>商品</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>小计</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // 添加购物车商品行（使用SVG图片）
    cartItems.forEach((item, index) => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        // 获取商品对应的颜色，默认灰色
        const bgColor = colorMap[item.image] || '#6c757d';
        // 截取商品名称前4个字显示在SVG中
        const shortName = item.name.substring(0, 4);
        
        cartHtml += `
            <tr data-index="${index}">
                <td><input type="checkbox" class="cart-item-checkbox" checked></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <!-- SVG商品图片（替代img标签） -->
                        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" class="cart-item-img">
                            <rect width="100%" height="100%" fill="#f1faee"/>
                            <rect x="10" y="10" width="60" height="60" rx="5" fill="${bgColor}"/>
                            <text x="50%" y="50%" font-size="10" fill="white" text-anchor="middle" font-family="Arial">${shortName}</text>
                        </svg>
                        <div>
                            <p style="font-weight: 500;">${item.name}</p>
                        </div>
                    </div>
                </td>
                <td>¥${item.price.toFixed(2)}</td>
                <td>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartItemQuantity(${index}, -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${index}, this.value)">
                        <button onclick="updateCartItemQuantity(${index}, 1)">+</button>
                    </div>
                </td>
                <td>¥${subtotal}</td>
                <td>
                    <span class="cart-remove" onclick="removeCartItem(${index})">
                        <i class="fas fa-trash-alt"></i> 删除
                    </span>
                </td>
            </tr>
        `;
    });
    
    cartHtml += `
            </tbody>
        </table>
    `;
    
    cartItemsContainer.innerHTML = cartHtml;
    
    // 重新绑定全选事件
    bindSelectAllEvent();
    
    // 绑定单个商品选择事件
    bindItemCheckboxEvents();
}

// 更新购物车商品数量
function updateCartItemQuantity(index, change) {
    let cartItems = getCartItems();
    
    if (index < 0 || index >= cartItems.length) return;
    
    // 如果是直接输入的数值
    if (typeof change === 'string') {
        const newQuantity = parseInt(change);
        if (newQuantity && newQuantity >= 1) {
            cartItems[index].quantity = newQuantity;
        } else {
            cartItems[index].quantity = 1; // 保底为1
        }
    } else {
        // 如果是增减操作
        cartItems[index].quantity += change;
        
        // 确保数量不小于1
        if (cartItems[index].quantity < 1) {
            cartItems[index].quantity = 1;
        }
    }
    
    // 保存更新后的购物车
    saveCartItems(cartItems);
    
    // 更新购物车总计
    updateCartSummary();
}

// 移除购物车商品
function removeCartItem(index) {
    if (!confirm('确定要删除该商品吗？')) return;
    
    let cartItems = getCartItems();
    
    // 删除指定索引的商品
    cartItems.splice(index, 1);
    
    // 保存更新后的购物车
    saveCartItems(cartItems);
    
    // 重新渲染购物车
    renderCartItems();
}

// 绑定全选事件
function bindSelectAllEvent() {
    const selectAllCheckbox = document.getElementById('select-all');
    if (!selectAllCheckbox) return;
    
    selectAllCheckbox.addEventListener('change', function() {
        const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        
        // 更新批量删除按钮状态
        updateBatchRemoveButton();
    });
}

// 绑定单个商品选择事件
function bindItemCheckboxEvents() {
    const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBatchRemoveButton);
    });
    
    // 初始化批量删除按钮状态
    updateBatchRemoveButton();
}

// 更新批量删除按钮状态
function updateBatchRemoveButton() {
    const batchRemoveBtn = document.getElementById('batch-remove');
    const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');
    
    // 检查是否有选中的商品
    const hasCheckedItems = Array.from(itemCheckboxes).some(checkbox => checkbox.checked);
    
    // 启用/禁用批量删除按钮
    batchRemoveBtn.disabled = !hasCheckedItems;
}

// 绑定批量删除事件
function bindBatchRemoveEvent() {
    const batchRemoveBtn = document.getElementById('batch-remove');
    if (!batchRemoveBtn) return;
    
    batchRemoveBtn.addEventListener('click', function() {
        if (!confirm('确定要删除选中的商品吗？')) return;
        
        let cartItems = getCartItems();
        const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');
        
        // 反向筛选：保留未被选中的商品
        const newCartItems = cartItems.filter((_, index) => {
            return !itemCheckboxes[index].checked;
        });
        
        // 保存更新后的购物车
        saveCartItems(newCartItems);
        
        // 重新渲染购物车
        renderCartItems();
    });
}

// 绑定清空购物车事件
function bindClearCartEvent() {
    const clearCartBtn = document.getElementById('clear-cart');
    if (!clearCartBtn) return;
    
    clearCartBtn.addEventListener('click', function() {
        if (confirm('确定要清空购物车吗？此操作不可恢复！')) {
            // 清空购物车
            saveCartItems([]);
            
            // 重新渲染购物车
            renderCartItems();
        }
    });
}

// 更新购物车总计
function updateCartSummary() {
    const totals = calculateCartTotal();
    
    // 更新显示
    document.getElementById('cart-subtotal').textContent = '¥' + totals.subtotal.toFixed(2);
    document.getElementById('cart-shipping').textContent = '¥' + totals.shipping.toFixed(2);
    document.getElementById('cart-total').textContent = '¥' + totals.total.toFixed(2);
    
    // 更新优惠券选择（模拟）
    updateCouponOptions(totals.subtotal);
}

// 更新优惠券选项（模拟）
function updateCouponOptions(subtotal) {
    const couponSelect = document.getElementById('coupon-select');
    if (!couponSelect) return;
    
    // 清空现有选项
    couponSelect.innerHTML = '<option value="0">请选择优惠券</option>';
    
    // 根据订单金额显示可用优惠券
    if (subtotal >= 500) {
        couponSelect.innerHTML += '<option value="50">满500减50</option>';
    }
    
    if (subtotal >= 1000) {
        couponSelect.innerHTML += '<option value="100">满1000减100</option>';
    }
    
    if (subtotal >= 2000) {
        couponSelect.innerHTML += '<option value="200">满2000减200</option>';
    }
    
    // 绑定优惠券应用事件
    bindApplyCouponEvent();
}

// 绑定优惠券应用事件
function bindApplyCouponEvent() {
    const applyCouponBtn = document.getElementById('apply-coupon');
    if (!applyCouponBtn) return;
    
    applyCouponBtn.addEventListener('click', function() {
        const couponSelect = document.getElementById('coupon-select');
        const discount = parseInt(couponSelect.value);
        
        if (discount <= 0) {
            alert('请选择有效的优惠券');
            return;
        }
        
        // 计算优惠后的总价
        const totals = calculateCartTotal();
        const discountedTotal = Math.max(0, totals.total - discount);
        
        // 更新显示（实际项目中应保存优惠券信息）
        document.getElementById('cart-discount').textContent = '¥' + discount.toFixed(2);
        document.getElementById('cart-total').textContent = '¥' + discountedTotal.toFixed(2);
        
        alert(`优惠券应用成功！立减¥${discount}`);
    });
}