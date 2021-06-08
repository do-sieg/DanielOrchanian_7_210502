import { useSnackbar } from "notistack";
import { useState } from "react";
import { appFetch } from "../utils/fetch";
import { isValidEmail } from "../utils/validation";

export default function SignupForm({ onFetchStart, onFetchEnd }) {
    const { enqueueSnackbar } = useSnackbar();
    // Fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Validation Errors
    const [errFirstName, setErrFirstName] = useState("");
    const [errLastName, setErrLastName] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");

    function handleChangeFirstName(e) {
        e.preventDefault();
        setFirstName(e.target.value);
    }

    function handleChangeLastName(e) {
        e.preventDefault();
        setLastName(e.target.value);
    }

    function handleChangeEmail(e) {
        e.preventDefault();
        setEmail(e.target.value);
    }

    function handleChangePassword(e) {
        e.preventDefault();
        setPassword(e.target.value);
    }

    function canSubmit() {

        setErrFirstName("");
        setErrLastName("");
        setErrEmail("");
        setErrPassword("");

        let test = true;
        if (firstName === "") {
            setErrFirstName("Veuillez renseigner ce champ");
            test = false;
        }
        if (lastName === "") {
            setErrLastName("Veuillez renseigner ce champ");
            test = false;
        }
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

        return test;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        const body = { firstName, lastName, email, password };

        onFetchStart();
        const result = await appFetch('post', '/auth/signup', body);
        onFetchEnd();
        enqueueSnackbar(result.message, { variant: result.status === 200 ? 'success' : 'error' });
    }

    return (
        <form>
            <label>Prénom</label>
            <input value={firstName} onChange={handleChangeFirstName} required />
            {errFirstName !== "" && <p className="form-error">{errFirstName}</p>}

            <label>Nom</label>
            <input value={lastName} onChange={handleChangeLastName} required />
            {errLastName !== "" && <p className="form-error">{errLastName}</p>}

            <label>E-mail</label>
            <input value={email} onChange={handleChangeEmail} required />
            {errEmail !== "" && <p className="form-error">{errEmail}</p>}

            <label>Mot de passe</label>
            <input type="password" value={password} onChange={handleChangePassword} required />
            {errPassword !== "" && <p className="form-error">{errPassword}</p>}

            <button className="success" onClick={handleSubmit}>S'inscrire</button>
        </form>
    );
}