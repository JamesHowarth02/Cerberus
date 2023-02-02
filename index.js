/*
    index.js
    Starts the bot and handles commands.

    James Howarth
    1/27/2023

*/

const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const { token, version, csgeneral } = require("./config.json");
const { status_phrases, report_phrases } = require("./phrases.json");
const cron = require("node-cron");
const googleSheetsFetcher = require("./commands/helpers/sheets-helper.js");
const createAssignmentEmbed = require("./commands/helpers/assignment-module.js");

// Method to parse phrases so we can add due dates to them
async function parsePhrase(phrase) {
  let assignmentsDue;
  let placeholder;
  if (phrase.includes("<assignmentsDueToday>")) {
    assignmentsDue = await googleSheetsFetcher.fetchToday();
    placeholder = "<assignmentsDueToday>";
  } else if (phrase.includes("<assignmentsDueTomorrow>")) {
    assignmentsDue = await googleSheetsFetcher.fetchTomorrow();
    placeholder = "<assignmentsDueTomorrow>";
  } else if (phrase.includes("<assignmentsDueYesterday>")) {
    assignmentsDue = await googleSheetsFetcher.fetchYesterday();
    placeholder = "<assignmentsDueYesterday>";
  } else {
    return phrase;
  }

  let count = 0;
  for (const className in assignmentsDue) {
    count += assignmentsDue[className].length;
  }

  return phrase.replace(placeholder, count.toString());
}

async function setRandomStatus() {
  const randomIndex = Math.floor(Math.random() * status_phrases.length);
  let phrase = await parsePhrase(status_phrases[randomIndex]);
  client.user.setPresence({
    activities: [{ name: phrase, type: ActivityType.Watching }],
    status: "dnd",
  });
}

// Initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize collection for commands
client.commands = new Collection();

// Define path and filter to read command files
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Loop through command files and add to collection
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Event listener when client is ready
client.once(Events.ClientReady, () => {
  console.clear();
  console.log(`Cerberus v${version} is now ready!`);
  setRandomStatus(); // so it sets an initial status

  setInterval(() => {
    setRandomStatus();
  }, 300000); // print every 5 minutes (300000 milliseconds)
});

// Minute, Hour, Day, Week, Month
cron.schedule("0 20 * * *", async () => {
  await client.channels.fetch(csgeneral);
  const embed = await createAssignmentEmbed("Today");
  const randomIndex = Math.floor(Math.random() * report_phrases.length);

  let phrase = report_phrases[randomIndex];
  client.channels.cache.get(csgeneral).send({content: "**" + phrase + "**", embeds: [embed]})
});

// Event listener for command execution
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
    console.log(`${interaction.user.username} ran ${interaction.commandName}`);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Log in to Discord
client.login(token);
