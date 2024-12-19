import { Request, Response, Router } from 'express';
import path from 'path';
const jsonServer: any = require('json-server');

// router instance
const menuRouter: Router = Router();

// path to the db.json file
const dbPath = path.join(__dirname, '../../db.json');

// created a json-server router instance pointing to the db.json file
const router = jsonServer.router(dbPath);

menuRouter.get('/', (req: Request, res: Response) => {
    const menuItems = router.db.get('menu_items').value();

    if (!menuItems || menuItems.length === 0) {
        return res.status(404).json({ msg: 'No items found' });
    }

    res.status(200).json(menuItems);
});

export default menuRouter;
