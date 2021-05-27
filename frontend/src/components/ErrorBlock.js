export default function ErrorBlock({ errCode }) {

    function getErrMessage() {
        switch (parseInt(errCode, 10)) {
            case 404:
                return "Page introuvable";
                break;
            default:
                return "Une erreur s'est produite";
                break;
        }
    }

    return (
        <div>
            <p>{errCode} | {getErrMessage(errCode)}</p>
        </div>
    );
}