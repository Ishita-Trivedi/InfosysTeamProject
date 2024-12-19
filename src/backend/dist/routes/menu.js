"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const jsonServer = require('json-server');
// router instance
const menuRouter = (0, express_1.Router)();
// path to the db.json file
const dbPath = path_1.default.join(__dirname, '../../db.json');
// created a json-server router instance pointing to the db.json file
const router = jsonServer.router(dbPath);
menuRouter.get('/', (req, res) => {
    const menuItems = router.db.get('menu_items').value();
    if (!menuItems || menuItems.length === 0) {
        return res.status(404).json({ msg: 'No items found' });
    }
    res.status(200).json(menuItems);
});
exports.default = menuRouter;
