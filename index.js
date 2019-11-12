const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public')); //allows use of stuff in ./public folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = process.env.PORT || "3000";   //changed to this as the website is now https

const mysql = require('mysql');
const sql_pw = 'baT7d()' + '\\' +'X!:h';    // raw: 'baT7d()\X!:h'
var azure_mysql_str = {
    connctionLimit: 5,
    host: "tic2601-ticketing.mysql.database.azure.com",
    user: "su@tic2601-ticketing",
    password: sql_pw,
    database: 'app', 
    port: 3306, 
    ssl: true
};
const local_mysql_str = {
    connctionLimit: 5,
    host: 'localhost',
    user: 'root',
    // user: 'su',
    //   password: 'baT7d()\X!:h',
    database: 'app'
};
const pool = mysql.createPool(azure_mysql_str);
// const connection = mysql.createConnection(azure_mysql_str);
// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected!');
// });

function renderMainPage(res, found) {
    pool.query(
        'SELECT City, Country from City ORDER BY City', (err, result, fields) => {
            if (err) {
                console.log(err);
                res.render('error', { err: 404 });  //when submit form.
            }
            else {
                res.render('main', { 'countries': result, 'found':found });
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
    renderMainPage(res, true);
});
app.post('/search', (req, res) => {
    let param = {};
    param.from = req.body.From;
    param.to = req.body.To;
    param.startDate = new Date(req.body.startDate);
    param.returnDate = new Date(req.body.returnDate);
    param.flightType = req.body.flightType; //referring to the type of flights

    startDateStr = (param.startDate.getMonth() + 1) + '/' + param.startDate.getDate() + '/' + param.startDate.getFullYear();
    returnDateStr = (param.returnDate.getMonth() + 1) + '/' + param.returnDate.getDate() + '/' + param.returnDate.getFullYear();
    fromCity = param.from.split(', ');
    toCity = param.to.split(', ');
    //flight_id, price, depart_time and arrival time.
    sqlquery =
        "SELECT f.FlightID, a.AirlineName, f.Route, f.BasePrice, r.DepartureDatetime, r.ArrivalDatetime FROM Flight f INNER JOIN Route r ON f.Route = r.Route RIGHT JOIN Airline a ON f.AirlineID = a.AirlineID WHERE r.DepartureCity = '" + fromCity[0]
        + "' and r.ArrivalCity = '" + toCity[0] + "' and r.DepartureDatetime LIKE '%"
        + startDateStr + "%' ORDER BY f.BasePrice ASC LIMIT 5"; //limiting to 5 as the db is overpopulated.
    pool.query(sqlquery, (err, result, fields) => {
        if (err) {
            console.log(err);
            res.render('500');
        }
        else {
            if (result.length == 0) {
                console.warn("no arrival flights found!");
                renderMainPage(res, false);
            }
            else {
                console.log('found arrival flights.');
                param.firstFlights = result;

                if (param.flightType != "oneway") {     //if return flight
                    console.log("checking return flights.");
                    sqlquery =
                        "SELECT f.FlightID, a.AirlineName, f.Route, f.BasePrice, r.DepartureDatetime, r.ArrivalDatetime FROM Flight f INNER JOIN Route r ON f.Route = r.Route RIGHT JOIN Airline a ON f.AirlineID = a.AirlineID WHERE r.DepartureCity = '" + toCity[0]
                        + "' and r.ArrivalCity = '" + fromCity[0] + "' and r.DepartureDatetime LIKE '%"
                        + returnDateStr + "%' ORDER BY f.BasePrice ASC LIMIT 5"; //limiting to 5 as the db is overpopulated.
                    pool.query(sqlquery, (err, next_result, fields) => {
                        if (err) {
                            console.log(err);
                            res.render('500');
                        } else {
                            if (result.length == 0) {
                                console.warn("no return flights found!");
                            }
                            else {
                                console.log('found return flights.');
                                // console.dir(next_result[0]);
                                param.nextFlights = next_result;
                                res.render('flightslists', param);
                            }
                        }
                    })
                }
                else {  //if one-way.

                }
            }
        }
    })
});
//403 forbidden, 404 not found, 500 internal server error

app.post('/particulars', (req, res) => {    //this is for inserting your personal particulars once you decide which flight to take.
    depart_arr = req.body.depart.split(',')
    return_arr = req.body.return.split(',')
    //get results from plane.
    console.log(req.body);
    pool.query("", (err, result, fields) => {

    })
    res.render('passenger_details', { planes: null });
}); //to implement
app.get('/test', (req, res) => {
    res.render("confirm_details");
});
app.get('/admin', (req, res) => { res.render('admin_login') });
app.post('/admin', (req, res) => { res.render('admin_panel') }); //to implement


app.get('/account', (req, res) => {
    pool.query(
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
            pool.query(
                'SELECT customer_id from customer where email=' + req.body.email
            )
        } catch (error) {
            console.log(error)
        }
    }
    else {
        try {
            pool.query(
                'SELECT customer_id from customer where firstname='
                + req.body.firstname + 'and lastname=' + req.body.lastname, (err, result, fields) => {

                }
            )
        } catch (error) {
            console.log(error)
        }
    }
    var constraint = (req.body.email != null) ? "email=" + req.body.email : "firstname=" + req.body.firstname + " and lastname=" + req.body.lastname;
    pool.query(
        'SELECT * from booking WHERE bookingID=' + req.body.bookingID + 'and ' + constraint, (err, result, fields) => {
            if (err) {
                console.log(err);
                res.render('error', { err: 404 });  //when submit form.
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