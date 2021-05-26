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
            {isAuthenticated ?
                <>
                    <Link to="/profile">Profil</Link>
                    <button onClick={handleLogout}>Déconnexion</button>
                </>
                :
                "NOPE"
            }
        </header>
    );
}