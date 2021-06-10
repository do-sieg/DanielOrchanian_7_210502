// General server error handler
export function handleServerError(req, res, err) {
    console.error("Error handler:", err.message);
    if ([
        'ER_DUP_ENTRY',
        'ER_DATA_TOO_LONG',
    ].includes(err.code)) {
        res.status(400).json({ data: null, message: err.code });
    } else {
        res.status(500).json({ data: null, message: "Erreur interne du serveur" });
    }
}
