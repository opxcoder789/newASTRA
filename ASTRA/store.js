// Store Page Logic - Product Display and Cart Management

// Sample products data - will be replaced by Appwrite data
let products = [
    {
        $id: '1',
        name: 'Baaj Brown Jacket',
        price: 149.99,
        image: '../assets/images/A372_4-15.jpg',
        description: 'Premium brown jacket with superior comfort',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        availability: 'In Stock'
    },
    {
        $id: '2',
        name: 'Classic White Tee',
        price: 29.99,
        image: '../assets/shoe-pink.png',
        description: 'Comfortable everyday white t-shirt',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        availability: 'In Stock'
    },
    {
        $id: '3',
        name: 'Black Denim Jeans',
        price: 79.99,
        image: '../assets/shoe-red.png',
        description: 'Classic black denim jeans with perfect fit',
        sizes: ['28', '30', '32', '34', '36', '38'],
        availability: 'In Stock'
    }
];

let cart = [];
let currentLayout = 6;
let filteredProducts = [...products];
let selectedProduct = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Store page loaded');
    
    // Ensure Appwrite is initialized
    if (typeof initializeAppwrite === 'function') {
        initializeAppwrite();
    } else {
        console.warn('Appwrite not initialized, will use fallback data');
    }
    
    // Load products from Appwrite (with fallback to sample data)
    await loadProducts();
    
    // Render initial product grid
    renderProductGrid();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update item count
    updateItemCount();
});

/**
 * Load products from Appwrite database
 */
async function loadProducts() {
    try {
        console.log('Fetching products from Appwrite...');
        const fetchedProducts = await fetchProducts();
        
        if (fetchedProducts && fetchedProducts.length > 0) {
            products = fetchedProducts;
            console.log('Products loaded from Appwrite:', products.length);
        } else {
            console.log('Using sample products (Appwrite data not available)');
        }
        
        filteredProducts = [...products];
    } catch (error) {
        console.error('Error loading products:', error);
        console.log('Using sample products');
    }
}

/**
 * Render product grid
 */
function renderProductGrid() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    productGrid.className = `grid grid-cols-${currentLayout}`;
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    updateItemCount();
}

/**
 * Create a product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Use product image, fallback to default
    const imageUrl = product.image 
        ? (product.image.startsWith('http') ? product.image : product.image)
        : '../assets/featured-shoe-main.jpg';
    
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${imageUrl}" 
                 alt="${product.name}" 
                 class="product-image"
                 onerror="this.src='../assets/featured-shoe-main.jpg'">
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <p class="product-availability">${product.availability || 'In Stock'}</p>
    `;
    
    card.addEventListener('click', () => showProductDetail(product));
    
    return card;
}

/**
 * Show product detail overlay
 */
function showProductDetail(product) {
    selectedProduct = product;
    const overlay = document.getElementById('productDetailOverlay');
    
    if (overlay) {
        overlay.classList.add('active');
        
        // Update detail content
        const titleEl = document.getElementById('detailTitle');
        const priceEl = document.getElementById('detailPrice');
        const mobileTitle = document.getElementById('mobileDetailTitle');
        const mobilePrice = document.getElementById('mobileDetailPrice');
        
        if (titleEl) titleEl.textContent = product.name;
        if (priceEl) priceEl.textContent = formatPrice(product.price);
        if (mobileTitle) mobileTitle.textContent = product.name;
        if (mobilePrice) mobilePrice.textContent = formatPrice(product.price);
        
        // Lock scroll on body
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide product detail overlay
 */
function closeProductDetail() {
    const overlay = document.getElementById('productDetailOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu
    const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    }
    
    // Cart menu
    const cartBtn = document.getElementById('cartBtn');
    const cartOverlay = document.querySelector('.cart-overlay');
    if (cartBtn && cartOverlay) {
        cartBtn.addEventListener('click', () => cartOverlay.classList.toggle('active'));
    }
    
    // Profile menu
    const profileBtn = document.getElementById('profileBtn');
    const profileOverlay = document.querySelector('.profile-overlay');
    if (profileBtn && profileOverlay) {
        profileBtn.addEventListener('click', () => profileOverlay.classList.toggle('active'));
    }
    
    // Search
    const searchBtn = document.getElementById('searchBtnStore');
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => searchOverlay.classList.add('active'));
    }
    
    const closeSearchBtn = document.getElementById('closeSearch');
    if (closeSearchBtn && searchOverlay) {
        closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));
    }
    
    const searchInput = document.getElementById('searchInputStore');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 0) {
                filteredProducts = products.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase())
                );
            } else {
                filteredProducts = [...products];
            }
            renderProductGrid();
        });
    }
    
    // Layout toggle
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
            e.target.closest('.layout-btn').classList.add('active');
            currentLayout = parseInt(e.target.closest('.layout-btn').dataset.layout);
            renderProductGrid();
        });
    });
    
    // Product detail back button
    const detailBackBtn = document.getElementById('detailBackBtn');
    if (detailBackBtn) {
        detailBackBtn.addEventListener('click', closeProductDetail);
    }
    
    // Add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }
    
    // Cart quantity controls
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    if (qtyMinus) qtyMinus.addEventListener('click', () => updateQty(-1));
    if (qtyPlus) qtyPlus.addEventListener('click', () => updateQty(1));
    
    // Close overlays on backdrop click
    document.querySelectorAll('.cart-overlay, .profile-overlay, .search-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.cart-overlay, .profile-overlay, .search-overlay').classList.remove('active');
        });
    });
}

/**
 * Update item count display
 */
function updateItemCount() {
    const itemCount = document.getElementById('itemCount');
    if (itemCount) {
        itemCount.textContent = `${filteredProducts.length} items`;
    }
}

/**
 * Add product to cart
 */
function addToCart() {
    if (!selectedProduct) return;
    
    const qtyValue = document.getElementById('qtyValue');
    const quantity = parseInt(qtyValue?.textContent || 1);
    
    const cartItem = {
        ...selectedProduct,
        quantity: quantity,
        cartId: Date.now()
    };
    
    cart.push(cartItem);
    console.log('Added to cart:', cartItem);
    
    // Show success message
    showNotification('Added to cart successfully!');
    
    // Close product detail
    closeProductDetail();
}

/**
 * Update quantity in detail view
 */
function updateQty(change) {
    const qtyValue = document.getElementById('qtyValue');
    const mQtyValue = document.getElementById('mqtyValue');
    
    let qty = parseInt(qtyValue?.textContent || 1);
    qty = Math.max(1, qty + change);
    
    if (qtyValue) qtyValue.textContent = qty;
    if (mQtyValue) mQtyValue.textContent = qty;
}

/**
 * Show notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2a2a2a;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        border: 1px solid #444;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations to style if not present
if (!document.getElementById('slideAnimations')) {
    const style = document.createElement('style');
    style.id = 'slideAnimations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
