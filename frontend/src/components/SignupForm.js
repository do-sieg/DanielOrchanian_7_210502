import { useState } from "react";
import { isValidEmail } from "../utils/validation";

export default function SignupForm({ onFetchStart, onFetchEnd }) {
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
        if (firstName === "") {
            setErrFirstName("Veuillez renseigner ce champ");
            return false;
        }
        if (lastName === "") {
            setErrLastName("Veuillez renseigner ce champ");
            return false;
        }
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

    function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        const body = { firstName, lastName, email, password };

        console.log(body);


        onFetchStart();
    }

    return (
        <form>
            <label>Prénom</label>
            <input value={firstName} onChange={handleChangeFirstName} required />
            {errFirstName !== "" && <p>{errFirstName}</p>}

            <label>Nom</label>
            <input value={lastName} onChange={handleChangeLastName} required />
            {errLastName !== "" && <p>{errLastName}</p>}

            <label>E-mail</label>
            <input value={email} onChange={handleChangeEmail} required />
            {errEmail !== "" && <p>{errEmail}</p>}

            <label>Mot de passe</label>
            <input type="password" value={password} onChange={handleChangePassword} required />
            {errPassword !== "" && <p>{errPassword}</p>}

            <button onClick={handleSubmit}>S'enregistrer</button>
        </form>
    );
}