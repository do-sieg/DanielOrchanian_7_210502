import { useRef, useState } from "react";
import { useHistory } from "react-router";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";
import { uploadFile } from "../utils/upload";



export default function EditPost() {
    const history = useHistory();

    const [load, setLoad] = useState(false);
    const [pageError, setPageError] = useState();

    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldText, setFieldText] = useState("");
    const [imageFile, setImageFile] = useState();

    // Validation Errors
    const [errTitle, setErrTitle] = useState("");
    const [errText, setErrText] = useState("");

    const inputFile = useRef(null);

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

    async function handleChangeImage(e) {
        e.preventDefault();

        const file = Array.from(e.target.files)[0];


        console.log(file);
        if (file) {
            setImageFile(file);
        }

        // if (file) {
        //     const result = await uploadFile("/posts/image", file);

        //     console.log({result});

        //     setImageFile(result.data);
        // } else {
        //     setImageFile(e.target.value);
        // }

    }

    function handleDeleteImage(e) {
        e.preventDefault();
        setImageFile(null);
        inputFile.current.value = "";
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        let body = { title: fieldTitle, text: fieldText };

        setLoad(true);

        let result;
        if (imageFile) {
            result = await uploadFile("/posts", imageFile, body);
        } else {
            result = await appFetch('post', '/posts', body);
        }


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

                        <label>Image</label>
                        <input type="file" ref={inputFile} onChange={handleChangeImage}></input>
                        {imageFile &&
                            <>
                                <img src={URL.createObjectURL(imageFile)} />
                                <button onClick={handleDeleteImage}>Annuler</button>
                            </>
                        }

                        <button onClick={handleSubmit}>Créer</button>
                        <button onClick={handleCancel}>Annuler</button>
                    </form>
            }
        </AuthLayout>
    );
}
