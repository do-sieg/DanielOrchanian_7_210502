import express from 'express';
import { auth } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { getUserById } from '../database/users';

const router = express.Router();

router.get("/profile", auth, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);

        console.log(decoded.user_id);

        const findUser = await getUserById(decoded.user_id, ["user_first_name", "user_last_name", "user_image_path"]);
        if (findUser) {
            res.status(200).json({ data: findUser });
        } else {
            throw new Error();
        }
    } catch (err) {
        handleServerError(req, res, err);
    }





    // try {
    //     const sauces = await Sauce.find();
    //     res.status(200).json(sauces);


});

export default router;