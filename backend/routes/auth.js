import express from 'express';
import { createUser, getUserByEmail } from '../database/users';
import { encryptPassword } from '../utils/bcrypt';
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

export default router;



// export default withMW(
//     mwValidateBodyFields({
//         firstName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
//         lastName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
//         email: [VLD_NOT_EMPTY_STRING, VLD_IS_EMAIL],
//         password: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
//         imagePath: [VLD_IS_URL],
//     }),
//     async (req, res) => {
//         try {
//             const checkUserExist = await getUserByEmail(req.body.email);
//             if (!checkUserExist) {
//                 const hash = await encryptPassword(req.body.password);
//                 const result = await createUser(req.body.firstName, req.body.lastName, req.body.email, hash, req.body.imagePath);
//                 res.status(200).json({ data: result, message: "Utilisateur enregistré" });
//             } else {
//                 res.status(400).json({ data: null, message: "Utilisateur déjà existant" });
//             }
//         } catch (err) {
//             handleServerError(req, res, err);
//         }
//     }
// );