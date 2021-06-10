import express from 'express';
import { auth } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { deleteUser, getUserById, updateUser } from '../database/users';
import { validateBodyFields, VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS } from '../utils/validation';

const router = express.Router();

router.get("/profile", auth, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.id, [
            "user_first_name AS firstName",
            "user_last_name AS lastName",
        ]);
        if (findUser) {
            res.status(200).json({ data: findUser });
        } else {
            throw new Error("Utilisateur introuvable");
        }
    } catch (err) {
        console.log(err);
        handleServerError(req, res, err);
    }
});

router.put("/profile", auth,
    validateBodyFields({
        firstName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
        lastName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
    }),
    async (req, res, next) => {
        try {
            const decoded = decodeToken(req.accessToken);
            const findUser = await getUserById(decoded.id, ["user_id"]);
            if (findUser) {

                await updateUser(findUser.user_id, req.body.firstName, req.body.lastName);

                res.status(200).json({ message: "Updated user profile" });
            } else {
                res.status(404).json({ message: "Can't find user." });
            }
        } catch (err) {
            handleServerError(req, res, err);
        }
    }
);


router.delete("/profile", auth, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.id, ["user_id"]);
        if (findUser) {

            await deleteUser(findUser.user_id);

            res.status(200).json({ message: "Deleted user profile" });
        } else {
            res.status(404).json({ message: "Can't find user." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

export default router;