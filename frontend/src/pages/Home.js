import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";


export default function Home() {

    const [load, setLoad] = useState(false);

    function handleStartLoad() {
        setLoad(true);
    }

    function handleEndLoad() {
        setLoad(false);
    }

    return (
        <div>
            {load ?
                <p>LOADING...</p>
                :
                <>
                    <SignupForm onFetchStart={handleStartLoad} onFetchEnd={handleEndLoad} />
                    <LoginForm onFetchStart={handleStartLoad} onFetchEnd={handleEndLoad} />
                </>
            }
        </div>
    );
}