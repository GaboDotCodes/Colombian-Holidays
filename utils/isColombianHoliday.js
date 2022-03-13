const holidaysByYear = require('./holidaysByYear');

/**
 * It allows you know if any day in Colombia is a holiday or not
 * @param {String} date DDMMYYYY For example: 24032020
 * @returns {Boolean} true if date is a holiday, false in other way
 */
 const isColombianHoliday = (date) => {
    if (date.length < 8 || isNaN(date)) throw "Wrong format, send that like DDMMYYYY For example: 24032020";

    const day = parseInt(date.slice(0, 2));
    const month = parseInt(date.slice(2, 4));
    const year = parseInt(date.slice(4));

    const dateObj = new Date(year, month - 1, day);
    const checkDate = (day === dateObj.getDate() && month === dateObj.getMonth() + 1 && year === dateObj.getFullYear())
    if (!checkDate) throw "Invalid date, that date does not exist"

    return { holiday: (holidaysByYear(year).holidays.filter(holiday => holiday.day === day && holiday.month === month).length === 1) };
}

module.exports = isColombianHoliday;