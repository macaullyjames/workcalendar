import { parseFile } from 'ical'
import dateFormat from 'dateformat'
import json2csv from 'json2csv'
import { writeFile } from 'fs'

const msToHours = (ms) => (Math.round((ms/3600000)*2)/2).toFixed(1)

const ical = parseFile('Personal.ics')
const fields = ['Date', 'Summary', 'Hours', 'Start', 'End', 'Note']
const data = Object.keys(ical)
  .map(key => {
    const { type, summary, start, end, description } = ical[key]
    if (type === 'VEVENT') return {
      Date: dateFormat(start, "yyyy-mm-dd"),
      Summary: summary,
      Hours: msToHours(end-start),
      Start: dateFormat(start, "HH:MM"),
      End: dateFormat(start, "HH:MM"),
      Note: description
    }
  })
  .filter(o => !!o)
  .sort((a, b) => {
    if (a.Date > b.Date) return 1
    if (a.Date < b.Date) return -1
    return 0
  })

const csv = json2csv({ fields, data });
 
writeFile('work.csv', csv, function(err) {
  if (err) throw err;
  console.log('Saved to work.csv');
});
