const holidays = require('./holidays.json');
const easterRelatedHolidays = require('./easterRelatedHolidays.json');

/**
 * This algotithm calculate easter day
 * See more: https://en.wikipedia.org/wiki/Date_of_Easter#Anonymous_Gregorian_algorithm
 * See more: http://www.cs.sjsu.edu/~pearce/modules/labs/compOrg/jasmin/Butcher.htm
 * @param {string} y Year to calculate its easter day
 * @returns {Date} Easter date
 */
const anonymousAlgorithm = (y) => {
    if (isNaN(y)) throw "Wrong format, year must be a number";
    const year = parseInt(y);
    const A = year % 19;
    const B = Math.floor(year / 100);
    const C = year % 100;
    const D = Math.floor(B / 4);
    const E = B % 4;
    const F = Math.floor((B + 8) / 25);
    const G = Math.floor((B - F + 1) / 3);
    const H = (19 * A + B - D - G + 15) % 30;
    const I = Math.floor(C / 4);
    const K = C % 4;
    const L = (32 + 2 * E + 2 * I - H - K) % 7;
    const M = Math.floor((A + 11 * H + 22 * L) / 451);
    const N = H + L - 7 * M + 114;
    const month = Math.floor(N / 31);
    const day = 1 + (N % 31);
    return new Date(year, month - 1, day)
}

/**
 * Calculate the next monday from a date, if date its monday returns date
 * @param {Date} date Day to calculate its next monday
 * @returns {Date} Next monday from date
 */
const nextMonday = (date) => {
    if (!(date instanceof Date)) throw 'Param "date" must be an instance of Date'
    if (date.getDay() === 1) return date;
    if (date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
    } else {
        const daysToAdd = 8 - date.getDay();
        date.setDate(date.getDate() + daysToAdd);
    }
    return date;
}

/**
 * Calculate all holidays in a year
 * @param {String} y Year to calculate its holidays
 * @returns {Array} All holidays in year
 */
const holidaysByYear = (y) => {
    if (isNaN(y)) throw "Wrong format, year must be a number";
    const year = parseInt(y);
    if (parseInt(year) < 1983) throw "This program is based in Colombian 51th law of 1983, therefore year must be greater than 1983";

    const normalHolidays = holidays.map(holidayDate => {
        const { day, month, name } = holidayDate;
        if (holidayDate.nextMonday === false) return { day, month, name };
        const holiday = nextMonday(new Date(year, month - 1, day));
        return { day: holiday.getDate(), month: holiday.getMonth() + 1, name }
    });

    const easterDate = anonymousAlgorithm(year);
    const easterHolidays = easterRelatedHolidays.map(holidayDate => {
        const { daysRelativeToEaster, name } = holidayDate;
        let holiday = new Date(easterDate.getTime());
        holiday.setDate(easterDate.getDate() + daysRelativeToEaster);
        if (holidayDate.nextMonday) holiday = nextMonday(holiday);
        return { day: holiday.getDate(), month: holiday.getMonth() + 1, name }
    });

    const allHolidays = [...normalHolidays, ...easterHolidays];
    allHolidays.sort((first, second) => {
        if (first.month < second.month) return -1
        if (first.month > second.month) return 1
        if (first.month === second.month) {
            if (first.day < second.day) return -1
            if (first.day > second.day) return 1
        }
    });
    return allHolidays;
}

/**
 * Calculate all holidays in a month
 * @param {String} monthYear MMYYYY For example: 072022
 * @returns {Array} Holidays in a month
 */
 const holidaysByMonth = (monthYear) => {
    if (monthYear.length < 6 || isNaN(monthYear)) throw "Wrong format, send that like MMYYYY For example: 072022";

    const month = parseInt(monthYear.slice(0, 2));
    const year = parseInt(monthYear.slice(2));

    if (month < 01 || month > 12 || year === 0000) throw "Invalid month or year" 

    return holidaysByYear(year).filter(holiday => holiday.month === month);
}

/**
 * It allows you know if any day in Colombia is a holiday or not
 * @param {String} date DDMMYYYY For example: 24032020
 * @returns {Boolean} true if date is a holiday, false in other way
 */
const isColombianHoliday = (date) => {
    try {
        if (date.length < 8 || isNaN(date)) throw "Wrong format, send that like DDMMYYYY For example: 24032020";
    
        const day = parseInt(date.slice(0, 2));
        const month = parseInt(date.slice(2, 4));
        const year = parseInt(date.slice(4));
    
        const dateObj = new Date(year, month - 1, day);
        const checkDate = (day === dateObj.getDate() && month === dateObj.getMonth() + 1 && year === dateObj.getFullYear())
        if (!checkDate) throw "Invalid date, that date does not exist"
    
        return (holidaysByYear(year).filter(holiday => holiday.day === day && holiday.month === month).length === 1);    
    } catch (error) {
        throw error
    }
}
