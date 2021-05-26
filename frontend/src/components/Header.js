import { deleteToken } from "../utils/token";
import { useHistory } from "react-router";

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

                <button onClick={handleLogout}>Logout</button>
                :
                "NOPE"
            }
        </header>
    );
}