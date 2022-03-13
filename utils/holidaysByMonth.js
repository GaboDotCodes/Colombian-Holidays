const holidaysByYear = require('./holidaysByYear');

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

    return { holidays: holidaysByYear(year).holidays.filter(holiday => holiday.month === month) };
}

module.exports = holidaysByMonth;