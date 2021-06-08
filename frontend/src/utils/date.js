// Format date to string
export function dateToString(date, format = 'YY-M-D') {
    const dt = new Date(date);
    const dd = dt.getDate();
    const mm = dt.getMonth() + 1;
    const yy = dt.getFullYear();
    let str = format;
    str = str.replace('D', dd > 9 ? dd : '0' + dd);
    str = str.replace('M', mm > 9 ? mm : '0' + mm);
    str = str.replace('YY', yy);
    str = str.replace('Y', yy.toString().substr(-2));
    return str;
}
