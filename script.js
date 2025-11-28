// =================================================
// 1. GLOBAL FUNCTIONS (Must be at the top)
// =================================================

// Add to Cart
window.addToCart = function(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the specific product
    const product = products.find(p => p.id === productId);
    
    if (product) {
        cart.push(product); // Add to our cart list
        localStorage.setItem('cart', JSON.stringify(cart)); // Save to browser
        alert("Added to Cart!"); 
    } else {
        alert("Error: Product not found!");
    }
};

// Remove from Cart
window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove 1 item at this index
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // Refresh to show changes
};

// Checkout Function (NEW)
window.checkout = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert("Your cart is empty! Add some products first.");
        return;
    }

    // Process Checkout
    localStorage.removeItem('cart'); // Clear the cart data
    alert("Checkout Successful! Thank you for your purchase.");
    window.location.href = 'index.html'; // Redirect to Home
};

// Logout Function
window.logout = function() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
};

// =================================================
// 2. PAGE SPECIFIC LOGIC (Runs when page loads)
// =================================================

document.addEventListener('DOMContentLoaded', function() {

    // --- REGISTRATION PAGE ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPass').value;
            const confirmPass = document.getElementById('regConfirmPass').value;

            if (password !== confirmPass) { alert("Passwords do not match!"); return; }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.email === email)) { alert("Email already exists!"); return; }

            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert("Registration Successful!");
            window.location.href = 'login.html';
        });
    }

    // --- LOGIN PAGE ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPass').value;

            if (email === "admin@gmail.com" && password === "admin123") {
                localStorage.setItem('loggedInUser', email);
                window.location.href = 'index.html'; 
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const validUser = users.find(u => u.email === email && u.password === password);

            if (validUser) {
                localStorage.setItem('loggedInUser', email);
                window.location.href = 'index.html';
            } else {
                alert("Invalid Credentials!");
            }
        });
    }

    // --- ADMIN PAGE: ADD PRODUCT ---
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newProduct = {
                id: Date.now(),
                name: document.getElementById('prodName').value,
                price: document.getElementById('prodPrice').value,
                img: document.getElementById('prodImg').value,
                desc: document.getElementById('prodDesc').value
            };
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            alert("Product Added!");
            window.location.href = 'index.html';
        });
    }

    // --- HOME PAGE: DISPLAY PRODUCTS ---
    const productContainer = document.getElementById('productContainer');
    if (productContainer) { // This checks if we are on the Home Page
        const user = localStorage.getItem('loggedInUser');
        const adminBtn = document.getElementById('adminBtn');
        
        if (!user) { window.location.href = 'login.html'; } // Security check
        
        // Show Admin Button
        if (adminBtn && user === 'admin@gmail.com') {
            adminBtn.style.display = 'inline-block';
        }

        // Render Products
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        if (products.length > 0) {
            productContainer.innerHTML = ''; 
            products.forEach(product => {
                productContainer.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card shadow h-100">
                            <img src="${product.img}" class="card-img-top" style="height:200px; object-fit:cover;">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p>${product.desc}</p>
                                <h6 class="text-primary">$${product.price}</h6>
                                <button onclick="window.addToCart(${product.id})" class="btn btn-warning w-100">Add to Cart</button>
                            </div>
                        </div>
                    </div>`;
            });
        }
    }

    // --- CART PAGE ---
    const cartTableBody = document.getElementById('cartTableBody');
    if (cartTableBody) {
        const emptyMsg = document.getElementById('emptyCartMsg');
        const totalSpan = document.getElementById('totalPrice');
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;

        if (cart.length === 0) {
            emptyMsg.style.display = 'block';
        } else {
            cart.forEach((item, index) => {
                total += Number(item.price);
                cartTableBody.innerHTML += `
                    <tr>
                        <td>
                            <img src="${item.img}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                            ${item.name}
                        </td>
                        <td>$${item.price}</td>
                        <td>
                            <button onclick="window.removeFromCart(${index})" class="btn btn-danger btn-sm">Remove</button>
                        </td>
                    </tr>
                `;
            });
        }
        totalSpan.innerText = total;
    }
});