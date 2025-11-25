import jsonServer from "json-server";
import cors from "cors";
import fs from "fs";
import path from "path";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Custom middleware for user registration
server.post("/users", (req, res) => {
  const db = router.db;
  const users = db.get("users").value();
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    cart: [],
    wishlist: [],
    orders: []
  };

  db.get("users").push(newUser).write();
  res.status(201).json({ status: "success", user: { id: newUser.id, name, email } });
});

// Custom middleware for user login
server.post("/users/login", (req, res) => {
  const db = router.db;
  const users = db.get("users").value();
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ status: "success", user: { id: user.id, name: user.name, email: user.email } });
});

// Custom middleware for password reset
server.patch("/users/reset", (req, res) => {
  const db = router.db;
  const users = db.get("users").value();
  const { email, password } = req.body;

  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  db.get("users").nth(userIndex).assign({ password }).write();
  res.json({ status: "success" });
});

// Custom middleware for adding to cart
server.put("/users/:id/cart", (req, res) => {
  const db = router.db;
  const userId = parseInt(req.params.id);
  const { productId, quantity = 1 } = req.body;

  const user = db.get("users").find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const cartItemIndex = user.cart.findIndex(item => item.productId === productId);
  if (cartItemIndex > -1) {
    // Item exists, increase quantity
    user.cart[cartItemIndex].quantity += quantity;
  } else {
    // Add new item
    user.cart.push({ productId, quantity });
  }

  db.get("users").find({ id: userId }).assign({ cart: user.cart }).write();
  res.json({ status: "success" });
});

// Custom middleware for creating orders
server.put("/users/:id/orders", (req, res) => {
  const db = router.db;
  const userId = parseInt(req.params.id);
  const { products } = req.body; // Array of { productId, quantity }

  const user = db.get("users").find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Decrease product counts
  products.forEach(item => {
    const product = db.get("products").find({ id: item.productId }).value();
    if (product) {
      const newCount = Math.max(0, product.count - item.quantity);
      db.get("products").find({ id: item.productId }).assign({ count: newCount }).write();
    }
  });

  // Create order
  const order = {
    id: Date.now(),
    products,
    date: new Date().toISOString()
  };

  user.orders.push(order);
  db.get("users").find({ id: userId }).assign({ orders: user.orders }).write();
  res.json({ status: "success", order });
});

// Custom middleware for adding to wishlist
server.post("/users/:id/wishlist", (req, res) => {
  const db = router.db;
  const userId = parseInt(req.params.id);
  const { productId } = req.body;

  const user = db.get("users").find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const wishlistIndex = user.wishlist.indexOf(productId);
  if (wishlistIndex > -1) {
    // Remove from wishlist
    user.wishlist.splice(wishlistIndex, 1);
  } else {
    // Add to wishlist
    user.wishlist.push(productId);
  }

  db.get("users").find({ id: userId }).assign({ wishlist: user.wishlist }).write();
  res.json({ status: "success" });
});

server.use(router);
server.listen(5001, () => {
  console.log("JSON Server is running on port 5001");
});
