const holidays = require("./holidays.json");


/**
 * This algotithm calculate the easter day
 * See more: https://en.wikipedia.org/wiki/Date_of_Easter#Anonymous_Gregorian_algorithm
 * See more: http://www.cs.sjsu.edu/~pearce/modules/labs/compOrg/jasmin/Butcher.htm
 * @param {string} year Year to calculate its easter day
 * @returns 
 */
const anonymousAlgorithm = (year) => {
	const year = parseInt(year);
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

const holidaysByYear = () => {
    
}

/**
 * It allows you know if any day in Colombia is a holiday or not
 * @param {String} date DDMMYYYY For example: 24032020
 */
const isColombianHoliday = (date) => {
    let isHoliday = false;
    
    if (date.length < 8 || isNaN(date)) throw "Wrong format, send that like DDMMYYYY For example: 24032020";

    const day = date.slice(0,2);
    const month = date.slice(2,4);
    const year = date.slice(4);

    if (day === "00" || month === "00" || year === "0000") throw "Days, months and years start counting by 1, not by 0";
    if (day > "31" || month > "12") throw "One month has max. 31 days and a year 12 months";

    holidays.map(holidayDate => {
        if (holidayDate.nextMonday === false) return {day: holidayDate.day, month: holidayDate.month};
        const dateObj = new Date(year, holidayDate.month, holidayDate.day);
        if (dateObj.getDay() === 1) return {day: holidayDate.day, month: holidayDate.month};
        if (dateObj.getDay() === 0) {
            dateObj.setDate(dateObj.getDate() + 1);
        } else {
            const daysToAdd = 8 - dateObj.getDate();
            dateObj.setDate(dateObj.getDate() + daysToAdd);
        }
        return {day: dateObj.getDate(), month: dateObj.getMonth() + 1}
    });

    isHoliday = (holidays
        .filter(holiday => (day == holiday.day && month == holiday.month))
        .length) === 1;
    
    if (isHoliday) return isHoliday;

    const dateFormated = new Date(year, month - 1, day);
    console.log(dateFormated.getDay())

    return isHoliday;
}

const result = isColombianHoliday("23092016");
//console.log(result);