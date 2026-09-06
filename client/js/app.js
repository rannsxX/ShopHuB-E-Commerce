let products = [];
let cart = JSON.parse(localStorage.getItem("shophub_cart")) || [];

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");

const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


// Load products
async function loadProducts() {
    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();

        products = data.products;

        renderProducts(products);
        updateCart();

    } catch (error) {
        console.error(error);

        productGrid.innerHTML = `
      <p class="error-message">
        Unable to load products.
      </p>
    `;
    }
}


// Render products
function renderProducts(items) {
    productCount.textContent = `${items.length} products`;

    if (items.length === 0) {
        productGrid.innerHTML = `
      <p class="empty-products">
        No products found.
      </p>
    `;

        return;
    }

    productGrid.innerHTML = items.map(product => `
    <article class="product-card">

      <img
        src="${product.image}"
        alt="${escapeHtml(product.name)}"
        class="product-image"
        loading="lazy"
      >

      <div class="product-info">

        <span class="product-category">
          ${escapeHtml(product.category)}
        </span>

        <h3 class="product-name">
          ${escapeHtml(product.name)}
        </h3>

        <p class="product-description">
          ${escapeHtml(product.description)}
        </p>

        <div class="product-bottom">

          <span class="product-price">
            Rs. ${formatPrice(product.price)}
          </span>

          <button
            class="add-cart-button"
            onclick="addToCart(${product.id})"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </article>
  `).join("");
}


// Add product
function addToCart(productId) {
    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        if (existingItem.quantity >= product.stock) {
            alert("Maximum available stock reached.");
            return;
        }

        existingItem.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();
    updateCart();
    openCart();
}


// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(
        product => product.id === productId
    );

    if (!item) {
        return;
    }

    if (item.quantity >= item.stock) {
        alert("Maximum available stock reached.");
        return;
    }

    item.quantity += 1;

    saveCart();
    updateCart();
}


// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(
        product => product.id === productId
    );

    if (!item) {
        return;
    }

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCart();
}


// Remove item
function removeFromCart(productId) {
    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    updateCart();
}


// Save cart
function saveCart() {
    localStorage.setItem(
        "shophub_cart",
        JSON.stringify(cart)
    );
}


// Update cart
function updateCart() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalItems;

    cartTotal.textContent =
        `Rs. ${formatPrice(totalPrice)}`;

    renderCartItems();
}


// Render cart
function renderCartItems() {

    if (cart.length === 0) {

        cartItems.innerHTML = `
      <p class="empty-cart">
        Your cart is empty.
      </p>
    `;

        return;
    }

    cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">

      <img
        src="${item.image}"
        alt="${escapeHtml(item.name)}"
        class="cart-item-image"
      >

      <div>

        <p class="cart-item-name">
          ${escapeHtml(item.name)}
        </p>

        <p class="cart-item-price">
          Rs. ${formatPrice(item.price)}
        </p>

        <div class="quantity-controls">

          <button
            onclick="decreaseQuantity(${item.id})"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            onclick="increaseQuantity(${item.id})"
          >
            +
          </button>

        </div>

      </div>

      <button
        class="remove-item"
        onclick="removeFromCart(${item.id})"
      >
        Remove
      </button>

    </div>
  `).join("");
}


// Search
function searchProducts() {

    const query = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    renderProducts(filteredProducts);
}


// Category filtering
document
    .querySelectorAll(".category-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category-button")
                .forEach(btn => {
                    btn.classList.remove("active");
                });

            button.classList.add("active");

            const category = button.dataset.category;

            if (category === "All") {
                renderProducts(products);
                return;
            }

            const filteredProducts = products.filter(
                product => product.category === category
            );

            renderProducts(filteredProducts);
        });

    });


// Search button
document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        searchProducts
    );


// Search Enter
searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        searchProducts();
    }

});


// Open cart
function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("show");
}


// Close cart
function closeCartDrawer() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("show");
}


// Cart buttons
cartButton.addEventListener(
    "click",
    openCart
);

closeCart.addEventListener(
    "click",
    closeCartDrawer
);

overlay.addEventListener(
    "click",
    closeCartDrawer
);


// Scroll to products
function scrollToProducts() {

    document
        .querySelector(".products-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// Format price
function formatPrice(price) {
    return Number(price).toLocaleString("en-IN");
}


// Escape HTML
function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// Start
loadProducts();