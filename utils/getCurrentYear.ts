import moment from "moment";


const getCurrentYear = () => {
    var currentDate = moment();

    var yearStart = currentDate.clone().startOf('year');

    var months: moment.Moment[] = [];

    for (var i = 0; i < 12; i++) {
        months.push(moment(yearStart).add(i, 'month'));
    }

    return months
}

export default getCurrentYear