import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import Loader from "../components/Loader";

export default function Posts() {
    // const history = useHistory();

    const [load, setLoad] = useState(true);


    return (
        <AuthLayout>
            {load ?
                <Loader />
                :
                "Posts"
            }
        </AuthLayout>
    );
}