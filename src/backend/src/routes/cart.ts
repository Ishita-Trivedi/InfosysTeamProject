import { Request, Response, Router } from 'express';
import path from 'path';
const jsonServer: any = require('json-server');
const cartRouter: Router = Router();
const dbPath = path.join(__dirname, '../../db.json');

const router = jsonServer.router(dbPath);

function getCartByCustomerId(customerId: number) {
    return router.db.get('cart').find({ customer_id: customerId }).value();
}

cartRouter.post('/addItem', (req: Request, res: Response) => {
    let { customer_id, item_id, quantity } = req.body;

    // Convert types to ensure consistency
    customer_id = Number(customer_id);
    item_id = Number(item_id);
    quantity = Number(quantity);

    if (!customer_id || !item_id || !quantity || quantity <= 0) {
        return res.status(400).json({ msg: 'Invalid or missing required fields' });
    }

    const cart = getCartByCustomerId(customer_id);

    if (cart) {
        const item = cart.items_array.find((item: { item_id: number }) => item.item_id === item_id);
        if (item) {
            item.quantity += quantity; // Proper numeric addition
        } else {
            cart.items_array.push({ item_id, quantity });
        }

        router.db.write();
        return res.status(200).json(cart);
    } else {
        const newCart = {
            cart_id: router.db.get('cart').value().length + 1,
            customer_id,
            items_array: [{ item_id, quantity }],
        };
        router.db.get('cart').push(newCart).write();
        return res.status(201).json(newCart);
    }
});
;
cartRouter.delete('/deleteItem', (req: Request, res: Response) => {
    let { customer_id, item_id, quantity } = req.body;

    // Convert to numbers for consistency
    customer_id = Number(customer_id);
    item_id = Number(item_id);
    quantity = Number(quantity);

    if (!customer_id || !item_id || !quantity || quantity <= 0) {
        return res.status(400).json({ msg: 'Invalid or missing required fields' });
    }

    const cart = getCartByCustomerId(customer_id);

    if (cart) {
        const itemIndex = cart.items_array.findIndex((item: { item_id: number }) => item.item_id === item_id);

        if (itemIndex !== -1) {
            const item = cart.items_array[itemIndex];
            item.quantity -= quantity; // Decrease the quantity

            if (item.quantity <= 0) {
                // If quantity is zero or less, remove the item from the cart
                cart.items_array.splice(itemIndex, 1);
            }

            // If the cart becomes empty, remove the entire cart
            if (cart.items_array.length === 0) {
                router.db.get('cart').remove({ customer_id }).write();
                return res.status(200).json({ msg: 'Cart updated successfully: cart is now empty', cart: null });
            } else {
                // Save the updated cart
                router.db.write();
                return res.status(200).json({ msg: 'Cart updated successfully', cart });
            }
        } else {
            return res.status(404).json({ msg: 'Item not found in cart', cart });
        }
    } else {
        return res.status(404).json({ msg: 'Cart not found for this customer', cart: null });
    }
});


// Route to get cart for a customer
cartRouter.get('/getCart', (req: Request, res: Response) => {
    const { customer_id } = req.query;

    if (!customer_id) {
        return res.status(400).json({ msg: 'Customer ID is required' });
    }

    const cart = getCartByCustomerId(Number(customer_id));

    if (cart) {
        return res.status(200).json(cart);
    } else {
        return res.status(404).json({ msg: 'Cart not found for this customer' });
    }
});

export default cartRouter;
