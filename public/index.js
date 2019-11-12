function eventCallback(elem) {

    let returnDate = document.getElementById("returnDateInput");
    switch (elem.id) {
        case "onewayflight":
            returnDate.hidden = true;
            returnDate.previousElementSibling.hidden = true;
            break;
        case "returnflight":
            returnDate.hidden = false;
            returnDate.previousElementSibling.hidden = false;
            // console.log("selected return");
            break;
        default:
            console.warn("unknown radio input")
            break;
    }
}
function get_seatsNumber() {
    var result = [0, 0]
    for (let i = 0; i < document.forms['detailsForm'].length; i++) {
        if (document.forms['detailsForm'][i].type != "checkbox")
            continue;
        else {
            if (document.forms['detailsForm'][i].id.indexOf('depart') != -1 && document.forms['detailsForm'][i].checked) {
                result[0] += 1;
            }
            else if (document.forms['detailsForm'][i].id.indexOf('return') != -1 && document.forms['detailsForm'][i].checked) {
                result[1] += 1;
            }
        }
    }
    return result;
}
function test() {
    console.log(pax);
    seats = get_seatsNumber();
    let flightLeg = event.target.id.split(' ')[0];
    if (flightLeg == 'depart' && seats[0] > pax)
        event.target.checked = false;
    if (flightLeg == 'return' && seats[1] > pax)
        event.target.checked = false;
    console.log("depart seats: " + seats[0]);
    console.log("return_seats: " + seats[1]);
}

function validateDetailsForm() {
    console.log(document.forms['detailsForm']);
    // test = document.forms['detailsForm'].find((e)=>{ return e.type == "checkbox"})
    // console.dir(test);
    return true;
}
function validateSearchForm() {
    var fromCountry = document.forms["searchFlightForm"]["From"].value;
    var toCountry = document.forms["searchFlightForm"]["To"].value;
    if (fromCountry == toCountry) {
        //alert("Cannot fly from and to the same airport.");
        return false;
    }
}