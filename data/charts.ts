import moment from "moment"


export const weekDays = [...moment.weekdaysShort().slice(1), moment.weekdaysShort()[0]]
export const monthNames = moment.monthsShort()
export const lineColors = ['#1E90FF', '#35de62', '#bd3bf5', '#f53b4e', '#fff024']