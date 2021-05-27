import BlankLayout from "../components/BlankLayout";
import ErrorBlock from "../components/ErrorBlock";

export default function Error404() {
    return (
        <BlankLayout><ErrorBlock errCode={404} /></BlankLayout>
    );
}
