import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";
import { uploadFile } from "../utils/upload";



export default function EditPost() {
    const history = useHistory();
    const params = useParams();

    const [load, setLoad] = useState(false);
    const [pageError, setPageError] = useState();

    const [isReply, setIsReply] = useState(false);
    const [fieldTitle, setFieldTitle] = useState("");
    const [fieldText, setFieldText] = useState("");
    const [imageFilePath, setImageFilePath] = useState("");
    const [newImageFile, setNewImageFile] = useState();

    // Validation Errors
    const [errTitle, setErrTitle] = useState("");
    const [errText, setErrText] = useState("");

    const inputFile = useRef(null);

    useEffect(() => {
        if (params.id) {
            loadPost(params.id);
        }
    }, [params.id]);

    async function loadPost(postId) {
        setLoad(true);
        const result = await appFetch('get', `/posts/view/${postId}`);
        if (result.status !== 200) {
            if (result.status === 401) {
                deleteToken();
                history.push("/");
            }
            setPageError(result.status);
            setLoad(false);
            return;
        }

        if (result.data.parentId !== 0) {
            setIsReply(true);
        }

        setFieldTitle(result.data.title);
        setFieldText(result.data.text);
        setImageFilePath(result.data.imagePath);
        setLoad(false);
    }

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
        if (file) {
            setNewImageFile(file);
        }
    }

    function handleDeleteImage(e) {
        e.preventDefault();
        setNewImageFile(null);
        if (imageFilePath) {
            if (window.confirm("Voulez-vous vraiment supprimer l'image du post ?")) {
                setImageFilePath(null);
            }
        }
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
        let method = 'post';
        let url = '/posts';
        if (params.id) {
            method = 'put';
            url = `/posts/${params.id}`;
        }
        if (newImageFile) {
            result = await uploadFile(method, url, newImageFile, body);
        } else {
            result = await appFetch(method, url, body);
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
                        {!isReply ?
                            <>
                                <input value={fieldTitle} onChange={handleChangeTitle} required />
                                {errTitle !== "" && <p>{errTitle}</p>}
                            </>
                            :
                            <p>{fieldTitle}</p>
                        }

                        <label>Texte</label>
                        <textarea value={fieldText} onChange={handleChangeText} required></textarea>
                        {errText !== "" && <p>{errText}</p>}

                        {!isReply &&
                            <>
                                <label>Image</label>
                                <input type="file" ref={inputFile} onChange={handleChangeImage}></input>
                                {newImageFile ?
                                    <img src={URL.createObjectURL(newImageFile)} alt="" />
                                    :
                                    imageFilePath &&
                                    <img src={`http://localhost:5000/public/images/${imageFilePath}`} alt="" />
                                }
                                {(newImageFile || imageFilePath) && <button onClick={handleDeleteImage}>Supprimer</button>}
                            </>
                        }
                        <button onClick={handleSubmit}>Créer</button>
                        <button onClick={handleCancel}>Annuler</button>
                    </form>
            }
        </AuthLayout>
    );
}
