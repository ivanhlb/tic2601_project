CREATE TABLE country (
    id int PRIMARY KEY CHECK(id >= 0),
    name VARCHAR(128) NOT NULL,
    continent VARCHAR(32) NOT NULL
);
INSERT INTO country VALUES
(1, 'Singapore', 'Asia'),
(2, 'Indonesia', 'Asia'),
(3, 'Malaysia', 'Asia'),
(4, 'Thailand', 'Asia'),
(5, 'Vietnam', 'Asia'),
(6, 'China', 'Asia'),
(7, 'Japan', 'Asia'),
(8, 'South Korea', 'Asia'),
(9, 'Egypt', 'Africa'),
(10, 'France', 'Europe'),
(11, 'Canada', 'America');

CREATE TABLE flight_schedule (
    flight_id VARCHAR(5) PRIMARY KEY,
    plane_id VARCHAR(32) FOREIGN KEY,
    airline_id CHAR(2) NOT NULL,
    departure_airport CHAR(3) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_airport CHAR(3) NOT NULL,
    arrival_time DATETIME NOT NULL
)
CREATE TABLE plane_layout(
    seat_id CHAR(2) PRIMARY KEY,
    class_type VARCHAR() 
)
select * from booking where booking_id = '12314' and
CREATE TABLE ticket (
    ticket_id CHAR(15) PRIMARY KEY,
    seat_id CHAR(2) FOREIGN KEY REFERENCES
        ◦ Seat ID FOREIGN KEY
        ◦ Booking ID FOREIGN KEY
        ◦ Customer ID FOREIGN KEY
)
CREATE TABLE booking (
    booking_id VARCHAR(8) PRIMARY KEY,
    flight_id VARCHAR(5) FOREIGN KEY REFERENCES flight_schedule(flight_id)
)
CREATE TABLE customer (
    customer_id int PRIMARY KEY CHECK(customer),
    firstname VARCHAR(64) NOT NULL,
    lastname VARCHAR(64) NOT NULL,
    
)