
// console.log(holidaysByYear(2022));
// console.log(holidaysByMonth('072021'));
// console.log(isColombianHoliday('21072022'));

const holidaysByYear = require('./utils/holidaysByYear');
const holidaysByMonth = require('./utils/holidaysByMonth')
const isColombianHoliday = require('./utils/isColombianHoliday')

const PROTO_PATH = __dirname + '/HolidaysResponse.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const holidays = grpc.loadPackageDefinition(packageDefinition).holidays;

const holidaysByYearRPC = (call, callback) => {
    const { date } = call.request;
    callback(null, holidaysByYear(date));
}

const holidaysByMonthRPC = (call, callback) => {
    const { date } = call.request;
    callback(null, holidaysByMonth(date));
}

const isColombianHolidayRPC = (call, callback) => {
    const { date } = call.request;
    callback(null, isColombianHoliday(date));
  }


const getServer = () => {
    const server = new grpc.Server();
    server.addService(holidays.HolidaysService.service, {
        holidaysByYear: holidaysByYearRPC,
        holidaysByMonth: holidaysByMonthRPC,
        isColombianHoliday: isColombianHolidayRPC
    });
    return server;
}
const routeServer = getServer();
routeServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
});