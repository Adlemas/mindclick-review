import moment from "moment";


const getCurrentMonth = () => {
    var currentDate = moment();

    var monthStart = currentDate.clone().startOf('month');

    var days: moment.Moment[] = [];

    for (var i = 0; i < currentDate.daysInMonth(); i++) {
        days.push(moment(monthStart).add(i, 'days'));
    }

    return days
}

export default getCurrentMonth