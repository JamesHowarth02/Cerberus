# Cerberus for Homework
Track due dates according to an external spreadsheet.

# TO-DO List:
- Add a navigation menu to paginate between dates (https://discordjs.guide/interactions/buttons.html#building-and-sending-buttons).
- Cache spreadsheet data to reduce API requests sent to Google Sheets.

# Contributing to the Bot
In this guide, you will learn how to set-up the bot in your own development environment to add your own commands.

**Creating your Discord Bot:**
1. Go to the Discord Developer Portal at https://discord.com/developers/
2. Click on the "My Apps" button in the top right corner of the page
3. Click on the "New App" button to create a new Discord bot
4. Fill in the name and description of your bot and click on the "Create" button
5. Navigate to the "Bot" section of your new app and click on the "Add Bot" button
6. Copy the token provided for your bot, as you will need it for authentication when using the Discord API
7. To invite your bot to a server, navigate to the "OAuth2" section and select the "bot" scope and permissions you want to give it. Then, select the server you want to invite the bot to and generate an invite link.
8. To use the bot, simply follow the invite link and invite it to your server.

Note: To use the bot, you will need to have the "Manage Server" permission on the server you want to add the bot to.

**Download the bot or clone the GitHub Repo to your local machine:**
1. Unzip the Cerberus folder and open it in your preferred IDE.
2. Create a file called `config.json` inside the workspace and paste the following JSON into it:
```json
{
	"guildId": "", // The guildId you're testing or running the bot in, i.e your server.
	"clientId": "", // The clientId of the Discord Bot, found on the Developer Portal.
	"token": "", // The token for your bot, keep this secret! This is also obtained on the Developer Portal.
	"version": "", // The current version to report in the log for Cerberus.
	"csgeneral": "" // The channel ID for the daily report to submit to.
}
```
3. Save this file and keep it in the same directory as the index.js file.

**Obtaining your Google Cloud Platform API Credentials:**
1. Go to the Google Cloud Platform website (https://console.cloud.google.com/) and sign in with your Google account.
2. Click on the project drop-down and create a new project or select an existing one.
3. On the left-hand side of the dashboard, navigate to the "APIs & Services" section and click on "Credentials."
4. On the Credentials page, click on the "Create credentials" button and select "Service account."
5. Give the service account a name, select "Editor" as the role, and click on "Continue."
6. On the next page, you can either create a new key or use an existing key. To create a new key, select "JSON" as the key type and click on "Create."
7. A credentials.json file will be downloaded to your computer. This file contains the private key and other information needed to authenticate with the Google Sheets API. Keep the credentials.json file safe, as it is required to access the Google Sheets API. 
8. Clone the spreadsheet with the due dates onto your own personal account and invite the email associated with the credentials.json to the spreadsheet.

Note: In order to access the specific spreadsheet you need to share the spreadsheet with the email id that is associated with the credentials.json file you obtained in step 7.

**Starting the Bot:**
1. Ensure you have NodeJS installed at the latest version: https://nodejs.org/
2. Open the folder the index.js is located in.
3. Open command prompt in this directory and run `npm install`
4. Run `node index.js`
5. If the bot says "Ready!" you're all set to go!

