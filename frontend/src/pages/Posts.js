import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";




export default function Posts() {
    const history = useHistory();

    // const [load, setLoad] = useState(true);
    const [load, setLoad] = useState(false); // TEST
    const [pageError, setPageError] = useState();

    
    const [postsList, setPostsList] = useState([]);

    useEffect(() => {
        loadPosts();
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


    return (
        <AuthLayout>
            {load ?
                <Loader />
                :
                pageError ?
                    <ErrorBlock errCode={pageError} />
                    :
                    <>
                        <button onClick={handleStartPost}>Créer une publication</button>

                        {postsList.map((post, index) => {
                            return (
                                <div key={index}>
                                    {post.title}
                                </div>
                            );
                        })}
                    </>
            }
        </AuthLayout>
    );
}