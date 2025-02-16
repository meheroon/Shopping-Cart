let products = [];
let cart = [];

// Fetch product data (can use API or a local JSON file)
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
  
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    
    cartItem.innerHTML = `
      <span>${item.product.name} (x${item.quantity})</span>
      <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
      <button onclick="removeFromCart(${item.product.id})">Remove</button>
    `;
    
    cartItemsContainer.appendChild(cartItem);
    totalPrice += item.product.price * item.quantity;
  });

  totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
}

function removeFromCart(productId) {
  const cartIndex = cart.findIndex(item => item.product.id === productId);
  if (cartIndex > -1) {
    cart.splice(cartIndex, 1);
    updateCart();
  }
}

document.getElementById('clear-cart').addEventListener('click', () => {
  cart = [];
  updateCart();
});

document.getElementById('checkout').addEventListener('click', () => {
  if (cart.length > 0) {
    alert('Proceeding to checkout...');
  } else {
    alert('Cart is empty');
  }
});
