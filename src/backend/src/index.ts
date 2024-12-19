// imports
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
const cors:any=require('cors');
const jsonServer: any = require('json-server');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create an instance of json-server router
const jsonServerRouter = jsonServer.router('./db.json'); // Path to your mock database file
const middlewares = jsonServer.defaults(); // Use default middlewares for json-server

// Routes imports
import cartRouter from './routes/cart';
import menuRouter from './routes/menu';
// import orderRouter from './routes/order';

// App requirements
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON request bodies

// Use json-server's default middlewares (e.g., CORS, static files, etc.)
app.use(middlewares);

// Root route
app.get('/check', (req: Request, res: Response) => {
    res.send('The server is up and running!');
});

// Routing the paths
app.use('/cart', cartRouter); 
app.use('/menu', menuRouter); 
// app.use('/order', orderRouter);

// // Add json-server routes (for handling the DB)
// app.use('/api', jsonServerRouter); // This will serve the mock database on /api route

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
