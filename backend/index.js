import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import router from './router';
import { initAllTables } from './database/init';

// Environment variables
dotenv.config();

// Set up express server
const app = express();

app.use(express.json());
app.use(helmet());

// CORS permissions
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Manage static requests for the /public route
app.use('/public', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(router);

// Port listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));

// Create tables
initAllTables();
