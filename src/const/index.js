var dateFormat = require('dateformat');

export function toStandardDate(date){
    const format = "yyyy-mm-dd"
    var d = date;
    if(typeof date === 'string'){
        d = new Date(date);   
    }
    return dateFormat(d,format);
}

export function toVNDate(date){
    const format = "dd/mm/yyyy"
    var d = date;
    if(typeof date === 'string'){
        d = new Date(date);   
    }
    return dateFormat(d,format);
}

export const paths = {
    login:"/",
    manager:"/manager",
    detailClass: (cl) => (`/manager/class-major/${cl}`),
    system:"/manager/system"
}