import { deleteToken } from "../utils/token";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

export default function Header({ isAuthenticated = false }) {

    const history = useHistory();

    function handleLogout(e) {
        e.preventDefault();

        deleteToken();
        history.push("/");
    }

    return (
        <header>
            <div className="inner-container">
                <img src={"/images/icon-left-font-monochrome-white.svg"} alt="Logo Groupomania" />
                {isAuthenticated &&
                    <nav>
                        <Link to="/posts">Posts</Link>
                        <Link to="/profile">Profil</Link>
                        <button onClick={handleLogout}>Déconnexion</button>
                    </nav>
                }
            </div>
        </header>
    );
}