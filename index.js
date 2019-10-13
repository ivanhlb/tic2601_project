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
    console.dir(req.body);
    let param = {};
    param.from = req.body.From;
    param.to = req.body.To;
    param.startDate = new Date(req.body.startDate);
    param.endDate = new Date(req.body.returnDate);
    param.flights = req.body.flights;
    // connection.query(
    //     'SELECT * FROM '
    // )    //to be done to integrate DB.
    res.render('flightslists', param);
});
//403 forbidden, 404 not found, 500 internal server error

app.post('/particulars', (req, res) => {
    console.dir(req.body);
    res.render('error', { err: 404 });
}); //to implement
app.get('/admin', (req, res) => { res.render('error', { err: 403 }) }); //to implement
app.get('/account', (req, res) => res.render('error', { err: 404 }));    //to implement
app.get('/*', (req, res) => res.render('error', { err: 404 }));         //default 404 route
app.listen(port, () => console.log(`Example app listening on port ${port}!`));