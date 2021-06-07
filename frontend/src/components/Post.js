import { useState } from "react";
import Linkify from "react-linkify";

export default function Post({ post, isReply = false, onReply, onDelete }) {

    const [fieldReplyText, setFieldReplyText] = useState("");
    // Validation Errors
    const [errReplyText, setErrReplyText] = useState("");

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
        const backgroundImage = `linear-gradient(175, hsl(${hue}, 50%, 85%), hsl(${hue}, 50%, 75%))`;
        const color = `hsl(${hue}, 50%, 30%)`;
        return { backgroundImage, color };
    }

    function handleChangeReplyText(e) {
        e.preventDefault();
        setFieldReplyText(e.target.value);
    }

    function canSubmit() {
        setErrReplyText("");

        let test = true;
        if (fieldReplyText === "") {
            setErrReplyText("Veuillez renseigner ce champ");
            test = false;
        }

        return test;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!canSubmit()) {
            return;
        }

        const body = { title: `Re: ${post.title}`, text: fieldReplyText };
        onReply(body);
    }

    async function handleDeletePost(e, postId) {
        e.preventDefault();
        onDelete(postId);
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

                <button onClick={(e) => handleDeletePost(e, post.id)}>Delete</button>
            </div>
            <div className="post-body">
                <Linkify><p>{post.text}</p></Linkify>
                {post.imagePath &&
                    <img src={`http://localhost:5000/public/images/${post.imagePath}`} />
                }
            </div>

            {(!isReply && post.replies && post.replies.length > 0) &&
                <>
                    <div className="replies-list">
                        {post.replies.map((reply) => {
                            return <Post key={reply.id} post={reply} isReply={true} />
                        })}
                    </div>

                    <form>
                        <textarea value={fieldReplyText} onChange={handleChangeReplyText}></textarea>
                        {errReplyText !== "" && <p>{errReplyText}</p>}
                        <button onClick={handleSubmit}>Répondre</button>
                    </form>
                </>
            }
        </div >
    );
}