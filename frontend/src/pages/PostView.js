import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import Post from "../components/Post";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";

// Post avec commentaires
export default function PostView() {
    const history = useHistory();
    const params = useParams();

    const [load, setLoad] = useState(true);
    const [pageError, setPageError] = useState();

    const [post, setPost] = useState();

    useEffect(() => {
        loadPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadPost() {
        setLoad(true);
        const result = await appFetch('get', `/posts/view/${params.id}`);
        if (result.status !== 200) {
            if (result.status === 401) {
                deleteToken();
                history.push("/");
            }
            setPageError(result.status);
            setLoad(false);
            return;
        }
        setPost(result.data);
        setLoad(false);
    }

    async function handleSubmitReply(replyBody) {
        setLoad(true);
        const result = await appFetch('post', `/posts/reply/${post.id}`, replyBody);
        if (result.status !== 200) {
            if (result.status === 401) {
                deleteToken();
                history.push("/");
            }
            toast.error(result.message, { autoClose: 2000 });
            setLoad(false);
            return;
        }
        // Reload post
        await loadPost();
        setLoad(false);
        toast.success(result.message, { autoClose: 2000 });
    }

    function handleEditPost(postId) {
        history.push({
            pathname: `/post_edit/${postId}`,
            state: { fromPostView: params.id },
        });
    }

    async function handleDeletePost(postId, parentId) {
        if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
            setLoad(true);
            const result = await appFetch('delete', `/posts/${postId}`);
            if (result.status !== 200) {
                if (result.status === 401) {
                    deleteToken();
                    history.push("/");
                }
                toast.error(result.message, { autoClose: 2000 });
                setLoad(false);
                return;
            }
            if (parentId === 0) {
                // Navigate to posts list when a base post is deleted
                history.push("/posts");
            } else {
                // Reload post when deleting a reply
                await loadPost();
            }
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
                    <div className="posts-list">
                        <Post key={post.id} post={post} onReply={handleSubmitReply} onEdit={handleEditPost} onDelete={handleDeletePost} />
                    </div>
            }
        </AuthLayout>
    );
}