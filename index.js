/*
    index.js
    Starts the bot and handles commands.

    James Howarth
    1/27/2023

*/

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize collection for commands
client.commands = new Collection();

// Define path and filter to read command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Loop through command files and add to collection
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Event listener when client is ready
client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

// Event listener for command execution
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Log in to Discord
client.login(token);
