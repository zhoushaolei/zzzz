// 移动端导航菜单
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if (burger && navLinks) {
        burger.addEventListener('click', function() {
            navLinks.classList.toggle('nav-active');
            
            // 汉堡按钮动画
            burger.classList.toggle('toggle');
        });
    }
    
    // 更新购物车数量显示
    updateCartCount();
    
    // 导航链接点击关闭菜单
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });
});

// 购物车相关函数
function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(cartItems) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
}

function updateCartCount() {
    const cartItems = getCartItems();
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        let totalCount = 0;
        cartItems.forEach(item => {
            totalCount += item.quantity;
        });
        cartCountElement.textContent = totalCount;
    }
}

// 添加商品到购物车
function addToCart(productId, productName, productPrice, productImage, quantity = 1) {
    const cartItems = getCartItems();
    
    // 检查商品是否已在购物车中
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // 更新数量
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        // 添加新商品
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        });
    }
    
    saveCartItems(cartItems);
    alert('商品已成功加入购物车！');
}

// 从购物车移除商品
function removeFromCart(productId) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCartItems(cartItems);
    
    // 如果在购物车页面，重新加载页面
    if (window.location.pathname.includes('cart.html')) {
        location.reload();
    }
}

// 更新购物车商品数量
function updateCartItemQuantity(productId, newQuantity) {
    const cartItems = getCartItems();
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = parseInt(newQuantity);
        // 确保数量至少为1
        if (cartItems[itemIndex].quantity < 1) {
            cartItems[itemIndex].quantity = 1;
        }
        saveCartItems(cartItems);
        
        // 如果在购物车页面，重新计算总价
        if (window.location.pathname.includes('cart.html')) {
            calculateCartTotal();
        }
    }
}

// 计算购物车总价
function calculateCartTotal() {
    const cartItems = getCartItems();
    let subtotal = 0;
    
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = subtotal > 0 ? 10 : 0; // 运费
    const total = subtotal + shipping;
    
    // 更新页面显示
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const totalElement = document.getElementById('cart-total');
    
    if (subtotalElement) subtotalElement.textContent = '¥' + subtotal.toFixed(2);
    if (shippingElement) shippingElement.textContent = '¥' + shipping.toFixed(2);
    if (totalElement) totalElement.textContent = '¥' + total.toFixed(2);
    
    return { subtotal, shipping, total };
}