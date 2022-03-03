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

module.exports = nextMonday;