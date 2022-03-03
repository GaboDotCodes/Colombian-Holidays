const holidays = require('../data/holidays.json');
const easterRelatedHolidays = require('../data/easterRelatedHolidays.json');
const nextMonday = require('./nextMonday');
const anonymousAlgorithm = require('./anonymousAlgorithm');

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

module.exports = holidaysByYear;