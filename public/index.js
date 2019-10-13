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
        case "multicityflight":
            returnDate.hidden = false;
            returnDate.previousElementSibling.hidden = false;
            // console.log("selected multicity");
            break;
        default:
            console.warn("unknown radio input")
            break;
    }
}

function onload() {
    //things here run when website loads

}
function validateForm() {
    var fromCountry = document.forms["searchFlightForm"]["From"].value;
    var toCountry = document.forms["searchFlightForm"]["To"].value;
    if (fromCountry == toCountry) {
        //alert("Cannot fly from and to the same airport.");
        return false;
    }
}
document.addEventListener("DOMContentLoaded", onload, false);