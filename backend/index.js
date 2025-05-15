import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { dirname } from 'path';
import path from 'path';

const app = express();
const port = 3001;

app.use(cors()); 

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

let __filename, __dirname;
if (typeof window === 'undefined') {
    // Check if running in a Node.js environment
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname(__filename);
} else {
    // Handle the case where the code might be running in a browser-like environment
    __filename = '';
    __dirname = '/';
}

// Basic calculator functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) {
        throw new Error('Divide by zero');
    }
    return a / b;
};
const mod = (a, b) => {
    if (b === 0) {
        return "NaN"; // Return string "NaN" instead of actual NaN
    }
    return a % b;
};
const power = (a, b) => Math.pow(a, b);
const sqrt = (a) => {
    if (a < 0) {
        throw new Error('Cannot compute square root of negative number');
    }
    return Math.sqrt(a);
};
const absolute = (a) => Math.abs(a);
const factorial = (a) => {
    if (a < 0) {
        throw new Error('Cannot compute factorial of negative number');
    }
    if (a === 0) {
        return 1;
    }
    let result = 1;
    for (let i = 1; i <= a; i++) {
        result *= i;
    }
    return result;
};
const square = (a) => a * a;

// API endpoints for calculator operations
app.post('/api/add', (req, res) => {
    const { a, b } = req.body;
    const result = add(a, b);
    res.json({ result });
});

app.post('/api/subtract', (req, res) => {
    const { a, b } = req.body;
    const result = subtract(a, b);
    res.json({ result });
});

app.post('/api/multiply', (req, res) => {
    const { a, b } = req.body;
    const result = multiply(a, b);
    res.json({ result });
});

app.post('/api/divide', (req, res) => {
    const { a, b } = req.body;
    try {
        const result = divide(a, b);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/mod', (req, res) => {
    const { a, b } = req.body;
    const result = mod(a, b);
    res.json({ result: result === "NaN" ? "NaN" : result });
});

app.post('/api/power', (req, res) => {
    const { a, b } = req.body;
    const result = power(a, b);
    res.json({ result });
});

app.post('/api/sqrt', (req, res) => {
    const { a } = req.body;
    try {
        const result = sqrt(a);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/absolute', (req, res) => {
    const { a } = req.body;
    const result = absolute(a);
    res.json({ result });
});

app.post('/api/factorial', (req, res) => {
    const { a } = req.body;
    try {
        const result = factorial(a);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/square', (req, res) => {
    const { a } = req.body;
    const result = square(a);
    res.json({ result });
});

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;