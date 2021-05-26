import { useState } from "react";
import AuthLayout from "../components/AuthLayout";

export default function Posts() {
    // const history = useHistory();

    const [load, setLoad] = useState(true);


    return (
        <AuthLayout>
            {load ?
                <p>LOADING...</p>
                :
                "Posts"
            }
        </AuthLayout>
    );
}