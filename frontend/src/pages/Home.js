import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {getToken} from "../utils/token";
import GuestLayout from "../components/GuestLayout";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";


export default function Home() {
    const history = useHistory();

    const [load, setLoad] = useState(true);

    useEffect(() => {
        // console.log(getToken());
        if (checkTokenRedirect() === false) {
            setLoad(false);
        }
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
                <p>LOADING...</p>
                :
                <>
                    <SignupForm onFetchStart={handleStartLoad} onFetchEnd={handleEndLoad} />
                    <LoginForm onFetchStart={handleStartLoad} onFetchEnd={handleEndLoad} />
                </>
            }
        </GuestLayout>
    );
}