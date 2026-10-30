// ===== Product Data =====
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Audio",
    price: 2999,
    image: "assets/headphones.jpg"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Wearables",
    price: 4999,
    image: "assets/watch.jpg"
  },
  {
    id: 3,
    name: "Classic Sneakers",
    category: "Footwear",
    price: 1799,
    image: "assets/sneakers.jpg"
  },
  {
    id: 4,
    name: "Leather Backpack",
    category: "Bags",
    price: 2499,
    image: "assets/backpack.jpg"
  },
  {
    id: 5,
    name: "Sunglasses",
    category: "Accessories",
    price: 899,
    image: "assets/sunglasses.jpg"
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug",
    category: "Home",
    price: 499,
    image: "assets/mug.webp"
  }
];

// ===== Format price in Indian Rupees =====
function formatPrice(n) {
  return "₹" + n.toLocaleString('en-IN');
}

// ===== Cart State =====
let cart = [];

// ===== DOM Refs =====
const productsEl = document.getElementById("products");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartBody = document.getElementById("cartBody");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ===== Render Products =====
function renderProducts() {
  productsEl.innerHTML = products.map(p => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}" class="product-image" />
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <span class="product-price">${formatPrice(p.price)}</span>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

// ===== Add to Cart =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

// ===== Change Quantity =====
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    renderCart();
  }
}

// ===== Remove from Cart =====
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

// ===== Render Cart =====
function renderCart() {
  // Count
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCount.textContent = count;

  // Total
  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  cartTotal.textContent = formatPrice(total);

  // Items
  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        Your cart is empty.<br />Add some products to get started.
      </div>`;
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatPrice(item.price)} each</span>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join("");
}

// ===== Open / Close Cart =====
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("open");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
}

// ===== Checkout =====
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  alert("Thank you! Your order of " + formatPrice(total) + " has been placed.");
  cart = [];
  renderCart();
  closeCartDrawer();
});

// ===== Events =====
cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

// ===== Init =====
renderProducts();
renderCart();
