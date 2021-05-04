export const VLD_NOT_NULL = 0;
export const VLD_IS_NUMBER = 1;
export const VLD_IS_STRING = 2;
export const VLD_NOT_EMPTY_STRING = 3;
export const VLD_NO_SPECIAL_CHARS = 4;
export const VLD_IS_EMAIL = 5;
export const VLD_IS_LOCALE = 6;
export const VLD_IS_URL = 7;

function hasSpecialChars(value, allowed = []) {
    const checks = [];
    checks.push(/[`!#$%^&*()+\=\[\]{};':"\\|,<>?~]/);
    if (!allowed.includes('@')) checks.push(/[@]/);
    if (!allowed.includes('-')) checks.push(/[-]/);
    if (!allowed.includes('_')) checks.push(/[_]/);
    if (!allowed.includes('.')) checks.push(/[.]/);
    if (!allowed.includes(' ')) checks.push(/[ ]/);
    if (!allowed.includes('/')) checks.push(/[/]/);

    let result = false;
    checks.forEach((rgx) => {
        if (rgx.test(value)) {
            result = true;
        }
    });
    return result;
}

function isValidEmail(value) {
    if (/\S+@\S+\.\S+/.test(value) && !hasSpecialChars(value, ['.', '@'])) {
        return true;
    }
    return false;
}

export function getValidationReport(targetObj, fields) {
    const report = [];

    Object.entries(fields).forEach(([key, vldTypes]) => {
        const value = targetObj[key];
        const requiredCheck = Object.prototype.hasOwnProperty.call(targetObj, key);
        const notNullCheck = (value !== null && value !== undefined);
        const isNumberCheck = !isNaN(parseFloat(value)) && isFinite(value);
        const isStringCheck = typeof value === 'string';
        let notEmptyStringCheck, noSpecialCharsCheck, isEmailCheck, isLocaleCheck, isUrlCheck = false;
        if (isStringCheck) {
            notEmptyStringCheck = (value).trim() !== '';
            noSpecialCharsCheck = !hasSpecialChars(value);
            isEmailCheck = isValidEmail(value);
            isLocaleCheck = !hasSpecialChars(value, ['_']);
            isUrlCheck = !hasSpecialChars(value, [':', '/', '-', '_']);
        }

        if (!requiredCheck) {
            report.push(`Paramètre manquant : ${key}`);

        } else if (vldTypes.includes(VLD_NOT_NULL) && !notNullCheck) {
            report.push(`Paramètre nul : ${key}`);

        } else if (vldTypes.includes(VLD_IS_NUMBER) && !isNumberCheck) {
            report.push(`Mauvais type : ${key} [got ${typeof value}]`);

        } else if (
            (
                vldTypes.includes(VLD_IS_STRING)
                || vldTypes.includes(VLD_NOT_EMPTY_STRING)
                || vldTypes.includes(VLD_IS_EMAIL)
                || vldTypes.includes(VLD_IS_LOCALE)
                || vldTypes.includes(VLD_IS_URL)
            )
            && !isStringCheck) {
            report.push(`Mauvais type : ${key} [got ${typeof value}]`);

        } else if (vldTypes.includes(VLD_NOT_EMPTY_STRING) && !notEmptyStringCheck) {
            report.push(`Paramètre vide : ${key}`);

        } else if (vldTypes.includes(VLD_NO_SPECIAL_CHARS) && !noSpecialCharsCheck) {
            report.push(`Caractères interdits : ${key}`);

        } else if (vldTypes.includes(VLD_IS_EMAIL) && !isEmailCheck) {
            report.push(`L'adresse e-mail n'est pas valide : ${key}`);

        } else if (vldTypes.includes(VLD_IS_LOCALE) && !isLocaleCheck) {
            report.push(`La locale n'est pas valide : ${key}`);

        } else if (vldTypes.includes(VLD_IS_URL) && !isUrlCheck) {
            report.push(`L'url n'est pas valide : ${key}`);

        }
    });

    return report;
}

export function validateBodyFields(fields) {
    return (req, res, next) => {
        const report = getValidationReport(req.body, fields);
        if (report.length === 0) {
            next();
        } else {
            res.status(400).json({ message: `Erreurs de paramètres : ${report.join(', ')}.` });
        }
    }
}