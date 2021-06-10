import BlankLayout from "../components/BlankLayout";
import ErrorBlock from "../components/ErrorBlock";

// Page erreur 404
export default function Error404() {
    return (
        <BlankLayout><ErrorBlock errCode={404} /></BlankLayout>
    );
}
