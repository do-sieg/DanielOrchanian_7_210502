import express from 'express';
import { createToken } from '../utils/token';
import { createUser, getUserByEmail } from '../database/users';
import { encryptPassword, verifyPassword } from '../utils/bcrypt';
import { handleServerError } from '../utils/errorHandler';
import { validateBodyFields, VLD_IS_EMAIL, VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS } from '../utils/validation';

const router = express.Router();

router.post("/signup",
    validateBodyFields({
        firstName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
        lastName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
        email: [VLD_NOT_EMPTY_STRING, VLD_IS_EMAIL],
        password: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
        // imagePath: [VLD_IS_URL],
    }),
    async (req, res, next) => {
        try {
            const checkUserExist = await getUserByEmail(req.body.email);
            if (!checkUserExist) {
                const hash = await encryptPassword(req.body.password);
                const result = await createUser(req.body.firstName, req.body.lastName, req.body.email, hash, req.body.imagePath);
                res.status(200).json({ data: result, message: "Utilisateur enregistré" });
            } else {
                res.status(400).json({ data: null, message: "Utilisateur déjà existant" });
            }
        } catch (err) {
            handleServerError(req, res, err);
        }
    }
);


router.post("/login",
    validateBodyFields({
        email: [VLD_NOT_EMPTY_STRING, VLD_IS_EMAIL],
        password: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
    }),
    async (req, res, next) => {
        try {
            const findUser = await getUserByEmail(req.body.email, ["user_id", "user_password"]);
            if (findUser) {
                const match = await verifyPassword(req.body.password, findUser.user_password);
                console.log("match", match);
                if (match === true) {
                    const token = await createToken({ user_id: findUser.user_id });
                    res.status(200).json({ data: token, message: "Utilisateur connecté" });
                } else {
                    res.status(400).json({ data: null, message: "Identifiants invalides" });
                }
            } else {
                res.status(400).json({ data: null, message: "Identifiants invalides" });
            }
        } catch (err) {
            handleServerError(req, res, err);
        }
    }
);

export default router;


