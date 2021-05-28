import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";



function Post({ post, isReply = false }) {
    return (
        <div className="post-container">
            {!isReply && <h2>{post.title}</h2>}
            <div>
                {!isReply ?
                    <span>Par <span className="user-name">{post.userFirstName} {post.userLastName}</span></span>
                    :
                    <span><span className="user-name">{post.userFirstName} {post.userLastName}</span> a répondu</span>
                }
                <time> le {post.creationDate}</time>
            </div>
            <p>{post.text}</p>
            {/* {post.imagePath} */}

            {!isReply &&
                <div className="replies-list">
                    {post.replies.map((reply, replyIndex) => {
                        return <Post key={replyIndex} post={reply} isReply={true} />
                    })}
                </div>
            }
        </div>
    );
}

// function PostReply({ post }) {
//     return (
//         <div className="reply-post">
//             <div>
//                 <span><span className="user-name">{post.userFirstName} {post.userLastName}</span> a répondu</span>
//                 <time> le {post.creationDate}</time>
//             </div>
//             {/* <h3>{post.title}</h3> */}
//             <p>{post.text}</p>
//             {/* {post.imagePath} */}
//         </div>
//     );
// }

export default function Posts() {
    const history = useHistory();

    // const [load, setLoad] = useState(true);
    const [load, setLoad] = useState(false); // TEST
    const [pageError, setPageError] = useState();


    const [postsList, setPostsList] = useState([]);

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

                        <div className="posts-list">

                            {postsList.map((post, index) => {
                                console.log(post);

                                return <Post key={index} post={post} />
                            })}
                        </div>
                    </>
            }
        </AuthLayout>
    );
}