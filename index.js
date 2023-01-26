const { Client, GatewayIntentBits } = require('discord.js')
const express = require("express");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // https://developers.google.com/workspace/guides/create-credentials
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    if (msg.content === '/duetomorrow') {
        main(msg);
    }
    console.log(msg.content)
});

const main = async (msg) => {
    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1qG28oJcWhqGYGNhCAML2xzKoSXxVjYURLtkGgCOGGRQ";

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Winter Semester 2023!A3:E80",
    });

    const rows = getRows.data.values;
    let message = "Tomorrow's Due Dates:\n"
    // Loop through rows and parse values
    rows.forEach(row => {
        if(row[4] == 1){
            let className = row[0]
            if(!className) {
                let i = 0;
                while(!className) {
                    className = rows[rows.indexOf(row) - i][0]
                    i++;
                }
            }
            message += "**[" + className + "]**\n" + row[2] + "\n"
        }
    });
    msg.reply(message);
}

client.login('token');
