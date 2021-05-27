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
        <div className="error-block">
            <p className="code">{errCode}</p>
            <p className="message">{getErrMessage(errCode)}</p>
        </div>
    );
}