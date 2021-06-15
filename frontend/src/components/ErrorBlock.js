// Bloc d'erreur
export default function ErrorBlock({ errCode }) {

    function getErrMessage() {
        let msg = "Une erreur s'est produite";
        switch (parseInt(errCode, 10)) {
            case 403:
                msg = "Accès non autorisé";
                break;
            case 404:
                msg = "Page introuvable";
                break;
            default:
                break;
        }
        return msg;
    }

    return (
        <div className="error-block">
            <p className="code">{errCode}</p>
            <p className="message">{getErrMessage(errCode)}</p>
        </div>
    );
}