/*
    sheet-helper.js
    Helper module for obtaining data from the spreadsheet.

    James Howarth
    1/27/2023

*/

const { google } = require("googleapis");

// Create an instance of the GoogleAuth class using the key file and the scope for the Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // https://developers.google.com/workspace/guides/create-credentials
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// The ID of the spreadsheet to read from
const spreadsheetId = "1qG28oJcWhqGYGNhCAML2xzKoSXxVjYURLtkGgCOGGRQ"

// The range of the spreadsheet to read from
const range = "Winter Semester 2023!A3:H80"

// variable to store the date of the sheet
let date = "";

// Asynchronous function to fetch the values of the sheet
const fetchSheetValues = async () => {
  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: range,
  });

  // Store the date of the sheet in the variable
  date = getRows.data.values[10][7];
  
  // Return the rows of the sheet
  return getRows.data.values
}

// Asynchronous function to fetch the classes by days left before the class
async function fetchByDaysLeft(daysLeft) {
    // Fetch the rows of the sheet
    const rows = await fetchSheetValues()
    
    // Loop through rows and parse values
    let className;
    let parsedArray = [];
    rows.forEach(row => {
        // check if the days left is equal to the passed parameter and the cell is not empty
        if(row[4] == daysLeft && row[4] != ""){
            className = row[0]
            // if the class name is not present, find the class name in the previous rows
            if(!className) {
                let i = 0;
                while(!className) {
                    className = rows[rows.indexOf(row) - i][0]
                    i++;
                }
                className = `[${className}] ${rows[rows.indexOf(row) - (i-1)][1]}`
            }
            // if the class name is already present in the parsedArray, add the class time to the same key
            if(parsedArray[className]){
                parsedArray[className].push(row[2]);
            } else {
                // if the class name is not present in the parsedArray, add the class name as key and class time as value
                parsedArray[className] = [row[2]];
            }
        }
    });
    return parsedArray;
}

// function to fetch the classes for today
function fetchToday() {
    return fetchByDaysLeft(0);
}

// function to fetch the classes for tomorrow
function fetchTomorrow() {
    return fetchByDaysLeft(1);
}

// function to fetch the classes for yesterday
function fetchYesterday() {
    return fetchByDaysLeft(-1);
}

// date according to the spreadsheet.
function getSheetDate() {
    return date;
}

module.exports = { fetchByDaysLeft, fetchToday, fetchTomorrow, fetchYesterday, getSheetDate };