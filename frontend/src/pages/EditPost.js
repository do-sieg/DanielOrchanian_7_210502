import { useState } from "react";
import { useHistory } from "react-router";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";



export default function EditPost() {
    const history = useHistory();

    const [load, setLoad] = useState(false);
    const [pageError, setPageError] = useState();

    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldText, setFieldText] = useState("");

    // // Validation Errors
    const [errTitle, setErrTitle] = useState("");
    const [errText, setErrText] = useState("");

    function handleChangeTitle(e) {
        e.preventDefault();
        setFieldTitle(e.target.value);
    }

    function handleChangeText(e) {
        e.preventDefault();
        setFieldText(e.target.value);
    }

    function canSubmit() {
        setErrTitle("");
        setErrText("");

        let test = true;
        if (fieldTitle === "") {
            setErrTitle("Veuillez renseigner ce champ");
            test = false;
        }
        if (fieldText === "") {
            setErrText("Veuillez renseigner ce champ");
            test = false;
        }

        return test;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        const body = { title: fieldTitle, text: fieldText };

        setLoad(true);

        const result = await appFetch('post', '/posts', body);

        if (result.status !== 200) {
            if (result.status === 401) {
                deleteToken();
                history.push("/");
            }
            setPageError(result.status);
            setLoad(false);
            return;
        }

        setLoad(false);
        alert(result.message);

        history.push("/posts");


    }

    function handleCancel(e) {
        e.preventDefault();
        history.push("/posts");
    }

    return (
        <AuthLayout>
            {load ?
                <Loader />
                :
                pageError ?
                    <ErrorBlock errCode={pageError} />
                    :
                    <form>
                        <label>Titre</label>
                        <input value={fieldTitle} onChange={handleChangeTitle} required />
                        {errTitle !== "" && <p>{errTitle}</p>}

                        <label>Texte</label>
                        <textarea value={fieldText} onChange={handleChangeText} required></textarea>
                        {errText !== "" && <p>{errText}</p>}

                        <button onClick={handleSubmit}>Créer</button>
                        <button onClick={handleCancel}>Annuler</button>
                    </form>
            }
        </AuthLayout>
    );
}
