import { useState } from "react";
import { appFetch } from "../utils/fetch";
import { isValidEmail } from "../utils/validation";

export default function LoginForm({ onFetchStart, onFetchEnd }) {
    // Fields
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [email, setEmail] = useState("test@test.test");
    const [password, setPassword] = useState("123");

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
        if (email === "") {
            setErrEmail("Veuillez renseigner ce champ");
            return false;
        }
        if (!isValidEmail(email)) {
            setErrEmail("Cette adresse e-mail n'est pas valide");
            return false;
        }
        if (password === "") {
            setErrPassword("Veuillez renseigner ce champ");
            return false;
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        const body = { email, password };

        console.log(body);


        onFetchStart();
        const result = await appFetch('post', '/auth/login', body);
        onFetchEnd();
        alert(result.message);
    }

    return (
        <form>
            <label>E-mail</label>
            <input value={email} onChange={handleChangeEmail} required />
            {errEmail !== "" && <p>{errEmail}</p>}

            <label>Mot de passe</label>
            <input type="password" value={password} onChange={handleChangePassword} required />
            {errPassword !== "" && <p>{errPassword}</p>}

            <button onClick={handleSubmit}>Se connecter</button>
        </form>
    );
}