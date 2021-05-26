import express from 'express';
import { auth } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { getUserById, updateUser } from '../database/users';

const router = express.Router();

router.get("/profile", auth, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.user_id, [
            "user_first_name AS firstName",
            "user_last_name AS lastName",
            "user_image_path AS imagePath",
        ]);
        if (findUser) {
            res.status(200).json({ data: findUser });
        } else {
            throw new Error();
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

router.post("/profile", auth, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.user_id, ["user_id"]);
        if (findUser) {

            await updateUser(findUser.user_id, req.body.firstName, req.body.lastName);

            res.status(200).json({ message : "Updated user profile" });
        } else {
            res.status(404).json({ message: "Can't find user." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

export default router;