import express, { NextFunction, Request, Response } from "express";
import { products } from "./products";

const app = express();
const port = process.env.PORT || 30788;
app.use(express.json());
app.use((req:Request, res:Response, next:NextFunction) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get("/products", (req:Request, res:Response) => {
    try {
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.get("/products/:id", (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const product = products.find((p) => p.id === parseInt(id));

        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post("/products", (req:Request, res:Response) => {
    try {
        const { name, category, price, stock } = req.body;
        if ( !name || !category || !price || !stock ) 
            return res.status(400).json({ error: "name, category, price, and stock are required." });

        const newProduct = {
            id: products.length + 1,
            name,
            category,
            price: parseFloat(price),
            stock: parseInt(stock)
        };

        products.push(newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.put("/products/:id", (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const { name, category, price, stock } = req.body;
    
        if (!name && !category && !price && !stock)
            return res.status(400).json({ error: "At least one field (name, category, price, or stock) is required for an update." });
    
        const productIndex = products.findIndex((p) => p.id === parseInt(id));
    
        if (productIndex === -1)
            return res.status(404).json({ error: "Product not found." });
    
        const updatedProduct = {
            id: parseInt(id),
            name: name || products[productIndex].name,
            category: category || products[productIndex].category,
            price: parseFloat(price) || products[productIndex].price,
            stock: parseInt(stock) || products[productIndex].stock,
        };
    
        products[productIndex] = updatedProduct;
    
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.delete("/products/:id", (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const productIndex = products.findIndex((p) => p.id === parseInt(id));

        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found." });
        }

        products.splice(productIndex, 1);

        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.listen(port, () => {
    console.log(`server start on port ${port}`);
});