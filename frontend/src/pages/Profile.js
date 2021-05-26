import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { appFetch } from "../utils/fetch";

export default function Profile() {
    const history = useHistory();

    const [load, setLoad] = useState(true);
    
    useEffect(async () => {
        async function loadProfile() {

            const result = await appFetch('get', '/users/profile');

            if (result.status !== 200) {
                alert(result.message);
                history.replace("/");
                return;
            }

            
            
            
            console.log("SUITE", result);

            // user_first_name: "test"
            // user_image_path: "undefined"
            // user_last_name:




            setLoad(false);
        }
        loadProfile();
    }, []);

    return (
        <div>
            {load ?
                <p>LOADING...</p>
                :
                <div>Profile</div>
            }
        </div>
    );
}