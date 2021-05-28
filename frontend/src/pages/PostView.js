import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import Post from "../components/Post";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";

export default function PostView() {

    const history = useHistory();
    const match = useRouteMatch();
    console.log(match.params.id);

    const [load, setLoad] = useState(true);
    const [pageError, setPageError] = useState();

    const [post, setPost] = useState();

    // Vérifier si le fetch régle le mauvais param tout seul

    useEffect(() => {
        loadPost();
    }, []);

    async function loadPost() {

        setLoad(true);
        const result = await appFetch('get', `/posts/view/${match.params.id}`);
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
        const result = await appFetch('post', `/posts/${post.id}`, replyBody);
        if (result.status !== 200) {
            if (result.status === 401) {
                deleteToken();
                history.push("/");
            }
            setPageError(result.status);
            setLoad(false);
            return;
        }

        await loadPost();

        setLoad(false);
        alert(result.message);
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
                            <>
                                <Post key={post.id} post={post} onReply={handleSubmitReply} />
                                <div className="post-actions">
                                    <Link to={`/post/${post.id}`}>Répondre</Link>
                                </div>
                            </>
                        </div>
                    </>
            }
        </AuthLayout>
    );
}