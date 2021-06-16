import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";

// Page de profil
export default function Profile() {
    const history = useHistory();

    const [load, setLoad] = useState(true);
    const [pageError, setPageError] = useState();

    const [fieldFirstName, setFieldFirstName] = useState("");
    const [fieldLastName, setFieldLastName] = useState("");

    // Validation Errors
    const [errFirstName, setErrFirstName] = useState("");
    const [errLastName, setErrLastName] = useState("");

    useEffect(() => {
        async function loadProfile() {

            const result = await appFetch('get', '/users/profile');

            if (result.status !== 200) {
                if (result.status === 401) {
                    deleteToken();
                    history.push("/");
                }
                setPageError(result.status);
                setLoad(false);
                return;
            }

            if (result.data) {
                setFieldFirstName(result.data.firstName);
                setFieldLastName(result.data.lastName);
                // setFieldImagePath(result.data.imagePath);
            } else {
                // ERREUR
            }
            setLoad(false);
        }
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    function handleChangeFirstName(e) {
        e.preventDefault();
        setFieldFirstName(e.target.value);
    }

    function handleChangeLastName(e) {
        e.preventDefault();
        setFieldLastName(e.target.value);
    }

    function canSubmit() {
        setErrFirstName("");
        setErrLastName("");

        let test = true;
        if (fieldFirstName === "") {
            setErrFirstName("Veuillez renseigner ce champ");
            test = false;
        }
        if (fieldLastName === "") {
            setErrLastName("Veuillez renseigner ce champ");
            test = false;
        }

        return test;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (window.confirm("Modifier les informations de profil ?")) {

            if (!canSubmit()) {
                return;
            }

            const body = { firstName: fieldFirstName, lastName: fieldLastName };

            setLoad(true);
            const result = await appFetch('put', '/users/profile', body);
            setLoad(false);
            if (result.status === 200) {
                toast.success(result.message, { autoClose: 2000 });
            } else {
                toast.error(result.message, { autoClose: 2000 });
            }
        }
    }

    async function handleDelete(e) {
        e.preventDefault();
        if (window.confirm("Supprimer le profil ? Cette action est irréversible.")) {
            setLoad(true);
            const result = await appFetch('delete', '/users/profile');
            setLoad(false);
            toast.info(result.message, { autoClose: 2000 });
            if (result.status === 200) {
                deleteToken();
                history.push("/");
            }
        }
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
                        <h1>Profil</h1>

                        <label>Prénom</label>
                        <input value={fieldFirstName} onChange={handleChangeFirstName} required />
                        {errFirstName !== "" && <p className="form-error">{errFirstName}</p>}

                        <label>Nom</label>
                        <input value={fieldLastName} onChange={handleChangeLastName} required />
                        {errLastName !== "" && <p className="form-error">{errLastName}</p>}

                        <div className="actions">
                            <button className="success" onClick={handleSubmit}>Sauvegarder les changements</button>
                            <button className="danger" onClick={handleDelete}>Supprimer le compte</button>
                        </div>
                    </form>
            }
        </AuthLayout>
    );
}