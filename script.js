let products = [];
let cart = [];
let promoApplied = false;
let discountAmount = 0;
let promoCode = '';

fetch('products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts();
  })
  .catch(error => console.log('Error fetching products:', error));

function displayProducts() {
  const productList = document.getElementById('product-list');
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 100%;">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    
    productList.appendChild(productCard);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.product.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  const cartCountElement = document.getElementById('cart-count');
  
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;
  let cartCount = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    
    cartItem.innerHTML = `
      <span>${item.product.name} (x${item.quantity})</span>
      <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
      <button onclick="removeFromCart(${item.product.id})">Remove</button>
      <button onclick="updateQuantity(${item.product.id}, 1)">+</button>
      <button onclick="updateQuantity(${item.product.id}, -1)">-</button>
    `;
    
    cartItemsContainer.appendChild(cartItem);
    totalPrice += item.product.price * item.quantity;
    cartCount += item.quantity;
  });

  // Apply discount if promo code is applied
  if (promoApplied) {
    totalPrice -= discountAmount;
    totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)} (Discount Applied)`;
  } else {
    totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
  }
  
  cartCountElement.innerText = `Items in Cart: ${cartCount}`;
}

function removeFromCart(productId) {
  const cartIndex = cart.findIndex(item => item.product.id === productId);
  if (cartIndex > -1) {
    cart.splice(cartIndex, 1);
    updateCart();
  }
}

function updateQuantity(productId, delta) {
  const cartItem = cart.find(item => item.product.id === productId);
  if (cartItem) {
    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) {
      cartItem.quantity = 1; // Prevent negative quantities
    }
    updateCart();
  }
}

document.getElementById('clear-cart').addEventListener('click', () => {
  cart = [];
  promoApplied = false;
  discountAmount = 0;
  updateCart();
});

document.getElementById('checkout').addEventListener('click', () => {
  if (cart.length > 0) {
    alert('Proceeding to checkout...');
    // You can redirect to a checkout page or show a modal with summary
  } else {
    alert('Cart is empty');
  }
});

// Promo Code logic
document.getElementById('apply-promo-code').addEventListener('click', () => {
  const promoCodeInput = document.getElementById('promo-code').value.trim().toLowerCase();
  const promoMessageElement = document.getElementById('promo-message');

  // Reset message
  promoMessageElement.innerText = '';

  // Check if promo code is valid
  if (promoCodeInput === 'ostad10' && !promoApplied) {
    promoCode = 'ostad10';
    discountAmount = calculateDiscount(0.10);
    promoApplied = true;
    promoMessageElement.innerText = 'Promo code applied: 10% off!';
  } else if (promoCodeInput === 'ostad5' && !promoApplied) {
    promoCode = 'ostad5';
    discountAmount = calculateDiscount(0.05);
    promoApplied = true;
    promoMessageElement.innerText = 'Promo code applied: 5% off!';
  } else if (promoCodeInput === '' || promoApplied) {
    promoMessageElement.innerText = 'Invalid or already used promo code.';
  } else {
    promoMessageElement.innerText = 'Invalid promo code.';
  }

  updateCart();
});

function calculateDiscount(percent) {
  let totalPrice = 0;
  cart.forEach(item => {
    totalPrice += item.product.price * item.quantity;
  });
  return totalPrice * percent;
}
