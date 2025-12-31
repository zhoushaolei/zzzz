// 商品数据
const productsData = [
    {
        id: 1,
        name: "高端智能手机",
        price: 5999,
        category: "electronics",
        image: "svg-mobile", // SVG标识
        rating: 4.5,
        sales: 1280,
        dateAdded: "2025-01-15"
    },
    {
        id: 2,
        name: "无线蓝牙耳机",
        price: 899,
        category: "audio",
        image: "svg-headset", // SVG标识
        rating: 4.0,
        sales: 2560,
        dateAdded: "2025-01-10"
    },
    {
        id: 3,
        name: "时尚智能手表",
        price: 1599,
        category: "electronics",
        image: "svg-watch", // SVG标识
        rating: 5.0,
        sales: 980,
        dateAdded: "2025-01-20"
    },
    {
        id: 4,
        name: "超薄笔记本电脑",
        price: 7999,
        category: "laptops",
        image: "svg-laptop", // SVG标识
        rating: 4.7,
        sales: 750,
        dateAdded: "2025-01-05"
    },
    {
        id: 5,
        name: "智能音箱",
        price: 499,
        category: "audio",
        image: "svg-speaker", // SVG标识
        rating: 4.2,
        sales: 1890,
        dateAdded: "2025-01-12"
    },
    {
        id: 6,
        name: "高速固态硬盘 1TB",
        price: 899,
        category: "accessories",
        image: "svg-ssd", // SVG标识
        rating: 4.8,
        sales: 1560,
        dateAdded: "2025-01-08"
    },
    {
        id: 7,
        name: "便携式充电宝 20000mAh",
        price: 299,
        category: "accessories",
        image: "svg-powerbank", // SVG标识
        rating: 4.3,
        sales: 3200,
        dateAdded: "2025-01-18"
    },
    {
        id: 8,
        name: "无线充电器",
        price: 199,
        category: "accessories",
        image: "svg-charger", // SVG标识
        rating: 3.5,
        sales: 2100,
        dateAdded: "2025-01-22"
    }
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化商品列表
    renderProducts(productsData);
    
    // 初始化分页
    initPagination();
    
    // 绑定筛选事件
    bindFilterEvents();
});

// 渲染商品列表（替换为SVG）
function renderProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // 清空现有内容
    productsGrid.innerHTML = '';
    
    // 如果没有商品
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3>暂无符合条件的商品</h3>
                <p style="color: #999; margin-top: 10px;">请尝试更换筛选条件</p>
            </div>
        `;
        document.getElementById('products-count').innerHTML = `共 <span>0</span> 件商品`;
        return;
    }
    
    // 更新商品数量
    document.getElementById('products-count').innerHTML = `共 <span>${products.length}</span> 件商品`;
    
    // 渲染商品卡片（使用SVG）
    products.forEach(product => {
        // 定义不同商品的SVG颜色
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
        const bgColor = colorMap[product.image] || '#6c757d';
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <!-- SVG商品图 -->
                <svg width="100%" height="200" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f1faee"/>
                    <rect x="100" y="20" width="300" height="160" rx="20" fill="${bgColor}"/>
                    <text x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" font-family="Arial">${product.name}</text>
                </svg>
            </div>
            <div class="product-info">
                <h3 class="product-name"><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                </div>
                <p class="product-price">¥${product.price.toFixed(2)}</p>
                <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">加入购物车</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// 生成星级评分
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // 添加满星
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // 添加半星
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // 添加空星
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// 初始化分页
function initPagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    // 简单分页（示例：每页4个商品）
    pagination.innerHTML = `
        <button class="pagination-btn" disabled>&laquo;</button>
        <button class="pagination-btn active">1</button>
        <button class="pagination-btn">2</button>
        <button class="pagination-btn">&raquo;</button>
    `;
    
    // 绑定分页按钮事件
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                // 移除其他按钮的active类
                paginationBtns.forEach(b => b.classList.remove('active'));
                // 添加当前按钮的active类
                this.classList.add('active');
                
                // 模拟分页切换（实际项目中应根据页码筛选商品）
                renderProducts(productsData);
            }
        });
    });
}

// 绑定筛选事件
function bindFilterEvents() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // 分类筛选
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    // 价格筛选
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    // 排序筛选
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

// 应用筛选条件
function applyFilters() {
    let filteredProducts = [...productsData];
    
    // 获取筛选条件
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    
    // 分类筛选
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // 价格筛选
    if (priceRange !== 'all') {
        const [minPrice, maxPrice] = priceRange.split('-');
        filteredProducts = filteredProducts.filter(product => {
            if (maxPrice === '+') {
                return product.price >= parseInt(minPrice);
            } else {
                return product.price >= parseInt(minPrice) && product.price <= parseInt(maxPrice);
            }
        });
    }
    
    // 排序
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'sales':
            filteredProducts.sort((a, b) => b.sales - a.sales);
            break;
        default:
            // 默认排序（按ID）
            filteredProducts.sort((a, b) => a.id - b.id);
            break;
    }
    
    // 渲染筛选后的商品
    renderProducts(filteredProducts);
}