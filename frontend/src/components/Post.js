
export default function Post({ post, isReply = false }) {

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




            {(!isReply && post.replies && post.replies.length > 0) &&
                <>
                    <div className="replies-list">
                        {post.replies.map((reply) => {
                            return <Post key={reply.id} post={reply} isReply={true} />
                        })}
                    </div>

                    {/* <div className="post-actions">
                            <button onClick={handleStartReply}>Répondre</button>
                    </div> */}
                </>
            }
        </div>
    );
}