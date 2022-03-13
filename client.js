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

const client = new holidays.HolidaysService('localhost:50051', grpc.credentials.createInsecure());

client.holidaysByYear({date: "2017"}, (error, feature) => {
    console.log(feature);
})

client.holidaysByMonth({date: "032022"}, (error, feature) => {
    console.log(feature);
})

client.isColombianHoliday({date: "20072022"}, (error, feature) => {
    console.log(feature);
})