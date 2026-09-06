const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./database/database");
const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Frontend
app.use(express.static(
    path.join(__dirname, "../client")
));


// API routes
app.use("/api/products", productRoutes);


// Health check
app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "ShopHub API is healthy"
    });

});


// Frontend fallback
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../client/index.html")
    );

});


// Start server
app.listen(PORT, () => {

    console.log(
        `ShopHub server running on http://localhost:${PORT}`
    );

});