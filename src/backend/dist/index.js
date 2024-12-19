"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require('cors');
const jsonServer = require('json-server');
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Create an instance of json-server router
const jsonServerRouter = jsonServer.router('./db.json'); // Path to your mock database file
const middlewares = jsonServer.defaults(); // Use default middlewares for json-server
// Routes imports
const cart_1 = __importDefault(require("./routes/cart"));
const menu_1 = __importDefault(require("./routes/menu"));
// import orderRouter from './routes/order';
// App requirements
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express_1.default.json()); // Middleware to parse JSON request bodies
// Use json-server's default middlewares (e.g., CORS, static files, etc.)
app.use(middlewares);
// Root route
app.get('/check', (req, res) => {
    res.send('The server is up and running!');
});
// Routing the paths
app.use('/cart', cart_1.default);
app.use('/menu', menu_1.default);
// app.use('/order', orderRouter);
// // Add json-server routes (for handling the DB)
// app.use('/api', jsonServerRouter); // This will serve the mock database on /api route
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
