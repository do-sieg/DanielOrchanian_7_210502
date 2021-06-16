import { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import Linkify from "react-linkify";
import { dateToString } from "../utils/date";
import { canDeletePost, canEditPost } from "../utils/frontAuth";

export default function Post({ post, isReply = false, onReply, onEdit, onDelete }) {
    // Fields
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
        const background = `hsl(${hue}, 30%, 80%)`;
        const color = `hsl(${hue}, 50%, 30%)`;
        return { background, color };
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

    async function handleEditPost(e, postId) {
        e.preventDefault();
        onEdit(postId);
    }

    async function handleDeletePost(e, postId, parentId) {
        e.preventDefault();
        onDelete(postId, parentId);
    }

    return (
        <div className="post-container">
            <div className="post-head">
                {!isReply && <h2>{post.title}</h2>}
                <div className="post-info">
                    {!isReply ?
                        <span>Par {renderUserInfo(post.userFirstName, post.userLastName)},&nbsp;</span>
                        :
                        <span>{renderUserInfo(post.userFirstName, post.userLastName)} a répondu&nbsp;</span>
                    }
                    <time>le {dateToString(post.creationDate, 'D/M/YY')}</time>
                </div>

            </div>
            <div className="post-body">
                <Linkify><p>{post.text}</p></Linkify>
                {(post.imagePath && !isReply) &&
                    <img src={`http://localhost:5000/uploads/${post.imagePath}`} alt={post.imagePath} />
                }
            </div>

            <div className="post-actions">
                {canEditPost(post.userId) &&
                    <button onClick={(e) => handleEditPost(e, post.id)}><FaEdit /></button>
                }
                {canDeletePost(post.userId) &&
                    <button onClick={(e) => handleDeletePost(e, post.id, post.parentId)}><FaTimes /></button>
                }
            </div>


            {!isReply &&
                <>
                    {(post.replies && post.replies.length > 0) &&
                        <div className="replies-list">
                            {post.replies.map((reply) => {
                                return <Post key={reply.id} post={reply} isReply={true} onEdit={onEdit} onDelete={onDelete} />
                            })}
                        </div>
                    }
                    {onReply &&
                        <form>
                            <textarea value={fieldReplyText} onChange={handleChangeReplyText}></textarea>
                            {errReplyText !== "" && <p className="form-error">{errReplyText}</p>}
                            <div className="actions">
                                <button className="success" onClick={handleSubmit}>Répondre</button>
                            </div>
                        </form>
                    }
                </>
            }
        </div >
    );
}