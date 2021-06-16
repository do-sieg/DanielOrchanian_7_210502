import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";
import { uploadFile } from "../utils/upload";

const acceptedFileTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
];

// Création/modification de post
export default function PostEdit() {
    const history = useHistory();
    const params = useParams();

    const [load, setLoad] = useState(true);
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
        // Si l'url a une id, on charge les données du post
        if (params.id) {
            loadPost(params.id);
        } else {
            setLoad(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    async function loadPost(postId) {
        setLoad(true);
        // Charger les données du post
        const result = await appFetch('get', `/posts/edit/${postId}`);
        if (result.status !== 200) {
            if (result.status === 401) {
                deleteToken();
                history.push("/");
            }
            setPageError(result.status);
            setLoad(false);
            return;
        }
        // Traiter le message comme un commentaire si nécessaire (champs cachés)
        if (result.data.parentId !== 0) {
            setIsReply(true);
        }
        // Remplir les champs
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
            if (acceptedFileTypes.includes(file.type)) {
                setNewImageFile(file);
            } else {
                toast.error("Type de fichier non accepté.", { autoClose: 2000 });
            }
        }
    }

    function handleDeleteImage(e) {
        e.preventDefault();
        setNewImageFile(null);
        if (imageFilePath) {
            if (window.confirm("Voulez-vous vraiment supprimer l'image du post ?")) {
                setImageFilePath("");
            }
        }
        inputFile.current.value = "";
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        let body = { title: fieldTitle, text: fieldText, imagePath: imageFilePath };

        setLoad(true);

        let result;
        let method = 'post';
        let url = '/posts';
        if (params.id) {
            method = 'put';
            url = `/posts/${params.id}`;
        }
        // Passer par une requête différente si une image est uploadée
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
            toast.error(result.message, { autoClose: 2000 });
            setLoad(false);
            return;
        }

        setLoad(false);
        toast.success(result.message, { autoClose: 2000 });

        history.push((
            history.location.state && history.location.state.fromPostView) ?
            `/post/${history.location.state.fromPostView}`
            :
            "/posts");
    }

    function handleCancel(e) {
        e.preventDefault();
        history.push((
            history.location.state && history.location.state.fromPostView) ?
            `/post/${history.location.state.fromPostView}`
            :
            "/posts");
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
                                {errTitle !== "" && <p className="form-error">{errTitle}</p>}
                            </>
                            :
                            <p>{fieldTitle}</p>
                        }

                        <label>Texte</label>
                        <textarea value={fieldText} onChange={handleChangeText} required></textarea>
                        {errText !== "" && <p className="form-error">{errText}</p>}

                        {!isReply &&
                            <>
                                <label>Image</label>
                                <input
                                    type="file"
                                    ref={inputFile}
                                    accept={acceptedFileTypes.join(", ")}
                                    onChange={handleChangeImage}
                                ></input>
                                {newImageFile ?
                                    <img src={URL.createObjectURL(newImageFile)} alt="" />
                                    :
                                    imageFilePath &&
                                    <img src={`http://localhost:5000/uploads/${imageFilePath}`} alt="" />
                                }
                                {(newImageFile || imageFilePath) && <button onClick={handleDeleteImage}>Supprimer</button>}
                            </>
                        }
                        <div className="actions">
                            <button className="success" onClick={handleSubmit}>{!params.id ? "Créer" : "Modifier"}</button>
                            <button className="danger" onClick={handleCancel}>Annuler</button>
                        </div>
                    </form>
            }
        </AuthLayout>
    );
}
