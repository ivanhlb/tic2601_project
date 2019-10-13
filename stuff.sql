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
    • Departure
            ▪ Airport
            ▪ Terminal
            ▪ DateTime
            ▪ Country
            ▪ City

    • Arrival
            ▪ Airport
            ▪ Terminal
            ▪ DateTime
            ▪ Country
            ▪ City
)