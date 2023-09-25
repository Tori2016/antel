import * as moment from 'moment';
moment.locale('es-do');

function formatDateNumber(date: number) {
  const fecha = moment(date).format('L');
  const time = moment(date).format('LT');
  const dateFormat = `${fecha}, ${time}`;
  return dateFormat;
}

function formatTime(date: number) {
  const time = moment(date).format('LTS');
  return time;
}

function dateToUnix(date: Date) {
  var d = new Date(date),
    ms = d.getTime(),
    time;
  time = ms;
  return time;
}

function unixToDate(ms: string) {
  var d = new Date(parseInt(ms)),
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
    time;

  time = dd + '/' + mm + '/' + yyyy;
  return time;
}

function unixToHora(ms: string) {
  var d = new Date(parseInt(ms)),
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),
    sec = ('0' + d.getSeconds()).slice(-2),
    time;

  time = h + ':' + min + ':' + sec;
  return time;
}

export { formatDateNumber, formatTime, dateToUnix, unixToDate, unixToHora };
