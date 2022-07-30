import moment from "moment";


const getCurrentWeek = () => {
    var currentDate = moment();

    var weekStart = currentDate.clone().startOf('isoWeek');

    var days: moment.Moment[] = [];

    for (var i = 0; i <= 6; i++) {
        days.push(moment(weekStart).add(i, 'days'));
    }

    return days
}

export default getCurrentWeek