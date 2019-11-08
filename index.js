const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public')); //allows use of stuff in ./public folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = 3000;

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //   password: 'TIC2601',
    database: 'app'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

function renderMainPage(res) {
    connection.query(
        'SELECT * from country ORDER BY name', (err, result, fields) => {
            if (err) {
                console.log(err);
                res.render('404');  //when submit form.
            }
            else {
                res.render('main', { 'countries': result });
            }
        }
    )
}

app.get('/', (req, res) => {
    //for now, just keep querying the db for all the countries that we can fly to and from.
    //todo: implement backend cache.
    //https://www.npmjs.com/package/memory-cache
    //https://medium.com/the-node-js-collection/simple-server-side-cache-for-express-js-with-node-js-45ff296ca0f0
    //also need to validate country input while ensuring that input is not autofilled
    renderMainPage(res);
});
app.post('/search', (req, res) => {
    let param = {};
    param.from = req.body.From;
    param.to = req.body.To;
    param.startDate = new Date(req.body.startDate);
    param.endDate = new Date(req.body.returnDate);
    param.flightType = req.body.flightType; //referring to the type of flights
    // connection.query(
    //     'SELECT * FROM '
    // )    //to be done to integrate DB.
    connection.query(
        'SELECT * from country ORDER BY name', (err, result, fields) => {
            if (err) {
                console.log(err);
                res.render('500');
            }
            else {

            }
        }
    )
    //REGION stand in data
    param.firstFlights = [
        { id: "SQ241", price: 1534.23, depart_time: new Date(param.startDate.getFullYear(), param.startDate.getMonth(), param.startDate.getDate(), 9, 20), arrival_time: new Date(param.startDate.getFullYear(), param.startDate.getMonth(), param.endDate.getDate(), 16, 50) },
        { id: "SQ161", price: 1234.23, depart_time: new Date(param.startDate.getFullYear(), param.startDate.getMonth(), param.startDate.getDate(), 11, 30), arrival_time: new Date(param.startDate.getFullYear(), param.startDate.getMonth(), param.endDate.getDate(), 19, 50) },
        { id: "SQ652", price: 1004.23, depart_time: new Date(param.startDate.getFullYear(), param.startDate.getMonth(), param.startDate.getDate(), 2, 30), arrival_time: new Date(param.startDate.getFullYear(), param.startDate.getMonth(), param.endDate.getDate(), 9, 50) }
    ]       //list of departing flights
    if (param.flightType != "oneway") {
        param.nextFlights = [ //list of returning/next multicity flights.
            { id: "SQ341", price: 1534.23, depart_time: new Date(param.endDate.getFullYear(), param.endDate.getMonth(), param.endDate.getDate(), 9, 25), arrival_time: new Date(param.endDate.getFullYear(), param.endDate.getMonth(), param.endDate.getDate(), 16, 50) },
            { id: "SQ761", price: 1234.23, depart_time: new Date(param.endDate.getFullYear(), param.endDate.getMonth(), param.endDate.getDate(), 11, 25), arrival_time: new Date(param.endDate.getFullYear(), param.endDate.getMonth(), param.endDate.getDate(), 19, 50) },
            { id: "SQ612", price: 1004.23, depart_time: new Date(param.endDate.getFullYear(), param.endDate.getMonth(), param.endDate.getDate(), 2, 30), arrival_time: new Date(param.endDate.getFullYear(), param.endDate.getMonth(), param.endDate.getDate(), 9, 50) }
        ]
    }
    //ENDREGION stand in data

    res.render('flightslists', param);
});
//403 forbidden, 404 not found, 500 internal server error

app.post('/particulars', (req, res) => {    //this is for inserting your personal particulars once you decide which flight to take.
    console.dir(req.body);
    //get results from plane.

    res.render('passenger_details', { planes: null });
}); //to implement
app.get('/test', (req, res) => {
    res.render("confirm_details");
});
app.get('/admin', (req, res) => { res.render('admin_login') });
app.post('/admin', (req, res) => { res.render('admin_panel') }); //to implement


app.get('/account', (req, res) => {
    connection.query(
        'SELECT * from country ORDER BY name', (err, result, fields) => {
            if (err) {
                console.log(err);
                res.render('404');  //when submit form.
            }
            else {
                res.render('account', { countries: result });
            }
        }
    )
});    //to implement
app.post('/account', (req, res) => {
    console.dir(req.body);
    if (req.body.email != null) {
        try {
            connection.query(
                'SELECT customer_id from customer where email=' + req.body.email
            )
        } catch (error) {
            console.log(error)
        }
    }
    else {
        try {
            connection.query(
                'SELECT customer_id from customer where firstname='
                + req.body.firstname + 'and lastname=' + req.body.lastname, (err, result, fields) => {

                }
            )
        } catch (error) {
            console.log(error)
        }
    }
    var constraint = (req.body.email != null) ? "email=" + req.body.email : "firstname=" + req.body.firstname + " and lastname=" + req.body.lastname;
    connection.query(
        'SELECT * from booking WHERE bookingID=' + req.body.bookingID + 'and ' + constraint, (err, result, fields) => {
            if (err) {
                console.log(err);
                res.render('404');  //when submit form.
            }
            else {
                res.render('account', { countries: result });
            }
        }
    )
});          //to implement


app.get('/*', (req, res) => res.render('error', { err: 404 }));          //default 404 route
app.post('/*', (req, res) => res.render('error', { err: 404 }));         //default 404 route
app.listen(port, () => console.log(`Example app listening on port ${port}!`));