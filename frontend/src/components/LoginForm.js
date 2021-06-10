import { useSnackbar } from "notistack";
import { useState } from "react";
import { appFetch } from "../utils/fetch";
import { storeToken } from "../utils/token";
import { isValidEmail, isValidPassword } from "../utils/validation";

// Formulaire de connection
export default function LoginForm({ onFetchStart, onFetchEnd }) {
    const { enqueueSnackbar } = useSnackbar();

    // Fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Validation Errors
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");

    function handleChangeEmail(e) {
        e.preventDefault();
        setEmail(e.target.value);
    }

    function handleChangePassword(e) {
        e.preventDefault();
        setPassword(e.target.value);
    }

    function canSubmit() {
        setErrEmail("");
        setErrPassword("");

        let test = true;
        if (email === "") {
            setErrEmail("Veuillez renseigner ce champ");
            test = false;
        }
        if (!isValidEmail(email)) {
            setErrEmail("Cette adresse e-mail n'est pas valide");
            test = false;
        }
        if (password === "") {
            setErrPassword("Veuillez renseigner ce champ");
            test = false;
        }
        if (!isValidPassword(password)) {
            setErrPassword("Mot de passe non valide (6 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial).");
            test = false;
        }

        return test;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        const body = { email, password };

        onFetchStart();
        const result = await appFetch('post', '/auth/login', body);
        enqueueSnackbar(result.message, { variant: result.status === 200 ? 'success' : 'error' });
        if (result.data) {
            storeToken(result.data);
        }
        onFetchEnd();
    }

    return (
        <form>
            <label>E-mail</label>
            <input value={email} onChange={handleChangeEmail} required />
            {errEmail !== "" && <p className="form-error">{errEmail}</p>}

            <label>Mot de passe</label>
            <input type="password" value={password} onChange={handleChangePassword} required />
            {errPassword !== "" && <p className="form-error">{errPassword}</p>}

            <div className="actions">
                <button className="success" onClick={handleSubmit}>Se connecter</button>
            </div>
        </form>
    );
}