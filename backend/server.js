// ============================
//   server.js (WORKING VERSION)
// ============================
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const brandsRoutes = require('./routes/brands');
const categoriesRoutes = require('./routes/categories');
const providersRoutes = require('./routes/providers');
const dashboardRoutes = require('./routes/dashboard');
const cartRoutes = require('./routes/cart');
const invoiceRoutes = require('./routes/invoice');

const app = express();   // ✅ MUST come before app.use()

app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/invoice', invoiceRoutes);

// PORT (use fallback 5001 because 5000 is used by macOS ControlCenter)
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
