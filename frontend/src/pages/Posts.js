import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AuthLayout from "../components/AuthLayout";
import ErrorBlock from "../components/ErrorBlock";
import Loader from "../components/Loader";
import { appFetch } from "../utils/fetch";
import { deleteToken } from "../utils/token";



function Post({ post, isReply = false }) {
    console.log(post);

    function renderUserInfo(firstName, lastName) {
        return (
            <div className="user-info">
                <div className="user-avatar" style={getAvatarColorStyle(post.userFirstName)}>
                    {post.userFirstName.slice(0, 1)}{post.userLastName.slice(0, 1)}
                </div>
                <span className="user-name">{firstName} {lastName}</span>
            </div>
        );
    }

    function getAvatarColorStyle(str) {
        const base = str.toLowerCase().charCodeAt(0) - 97;
        const hue = base * 10;
        const backgroundColor = `hsl(${hue}, 50%, 80%)`;
        const color = `hsl(${hue}, 50%, 30%)`;
        return { backgroundColor, color };
    }

    return (
        <div className="post-container">
            <div className="post-head">
                {!isReply ?
                    <>
                        <h2>{post.title}</h2>
                        <span>Par {renderUserInfo(post.userFirstName, post.userLastName)}</span>
                    </>
                    :
                    <span>{renderUserInfo(post.userFirstName, post.userLastName)} a répondu</span>
                }
                <time> le {post.creationDate}</time>
            </div>
            <div className="post-body">
                <p>{post.text}</p>
            </div>
            {/* {post.imagePath} */}

            {!isReply &&
                <div className="replies-list">
                    {post.replies.map((reply) => {
                        return <Post key={reply.id} post={reply} isReply={true} />
                    })}
                </div>
            }
        </div>
    );
}


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
                            {postsList.map((post) => {
                                return <Post key={post.id} post={post} />
                            })}
                        </div>
                    </>
            }
        </AuthLayout>
    );
}