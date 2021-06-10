import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {getToken} from "../utils/token";
import GuestLayout from "../components/GuestLayout";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import Loader from "../components/Loader";

// Page d'accueil
export default function Home() {
    const history = useHistory();

    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (checkTokenRedirect() === false) {
            setLoad(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function checkTokenRedirect() {
        if (getToken() !== null) {
            history.replace("/posts");
            return true;
        }
        return false;
    }

    function handleStartLoad() {
        setLoad(true);
    }

    function handleEndLoad() {
        if (checkTokenRedirect() === false) {
            setLoad(false);
        }
    }

    return (
        <GuestLayout>
            {load ?
                <Loader />
                :
                <div className="home-container">
                    <LoginForm onFetchStart={handleStartLoad} onFetchEnd={handleEndLoad} />
                    <p className="home-or">OU</p>
                    <SignupForm onFetchStart={handleStartLoad} onFetchEnd={handleEndLoad} />
                </div>
            }
        </GuestLayout>
    );
}