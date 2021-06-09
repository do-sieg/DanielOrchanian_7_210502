import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import Post from "../components/Post";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";
import { FaPlusSquare } from "react-icons/fa";
import { useSnackbar } from "notistack";


export default function Posts() {
    const history = useHistory();

    const [load, setLoad] = useState(true);
    const [pageError, setPageError] = useState();

    const [postsList, setPostsList] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadPosts() {
        setLoad(true);
        const result = await appFetch('get', '/posts');
        if (result.status !== 200) {
            if (result.status === 401) {
                deleteToken();
                history.push("/");
            }
            setPageError(result.status);
            setLoad(false);
            return;
        }

        setPostsList(result.data);
        setLoad(false);
    }


    function handleStartPost(e) {
        e.preventDefault();
        history.push("/post_edit");
    }

    function handleEditPost(postId) {
        history.push(`/post_edit/${postId}`);
    }

    async function handleDeletePost(postId) {
        if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
            setLoad(true);
            const result = await appFetch('delete', `/posts/${postId}`);
            if (result.status !== 200) {
                if (result.status === 401) {
                    deleteToken();
                    history.push("/");
                }
                enqueueSnackbar(result.message, { variant: 'error' });
                setLoad(false);
                return;
            }

            enqueueSnackbar(result.message, { variant: 'success' });
            await loadPosts();
            setLoad(false);
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
                    <>

                        <div className="posts-list">
                            <div style={{ marginBottom: '1rem' }}>
                                <button className="btn btn-success" onClick={handleStartPost}><FaPlusSquare /> Créer une publication</button>
                            </div>
                            {postsList.map((post) => {
                                return (
                                    <React.Fragment key={post.id}>
                                        <Post post={post} onEdit={handleEditPost} onDelete={handleDeletePost} />
                                        <div className="post-reply-link">
                                            <Link to={`/post/${post.id}`}>Réponses</Link>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </>
            }
        </AuthLayout>
    );
}