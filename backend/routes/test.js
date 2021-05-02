import express from 'express';

const router = express.Router();

router.get("/", async (req, res, next) => {
    res.send('Bienvenue sur la route de test.');
});

export default router;