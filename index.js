const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const holidaysByYear = require('./utils/holidaysByYear');
const holidaysByMonth = require('./utils/holidaysByMonth');
const isColombianHoliday = require('./utils/isColombianHoliday');

const { PORT } = process.env;


const app = express();
const port = PORT || 3000;

const whiteList = { origin: ['http://localhost:5500', 'https://gabodotcodes.github.io']};

const limiter = rateLimit({
	windowMs: 1000,
	max: 1,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(cors(whiteList));
app.use(limiter);
app.use(morgan('tiny'));

app.get('/api/holidays/:date', (req, res) => {
  try {
    const { by } = req.query;
    const { date } = req.params;
    switch (by) {
      case 'month':
        res.send(holidaysByMonth(date));
        break;
      case 'year':
        res.send(holidaysByYear(date));
        break;
      default:
        res.statusCode = 400;
        res.send('Must include de "by" param that accept "year" and "month" values');
    }
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }

})

app.get('/api/holiday/:date', (req, res) => {
  try {
    const { date } = req.params;
    res.send(isColombianHoliday(date));
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})