
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import router from './router';

// Set up express server
const app = express();

app.use(bodyParser.json());

// CORS permissions
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Manage static requests for the /images route
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use(router);

// Port listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));

