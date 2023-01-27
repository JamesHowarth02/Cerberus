/*
    avatar.js
    Example command for obtaining the select user's avatar.

    discord.js guide
    1/27/2023

*/
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar') //set the command name 
		.setDescription('Get the avatar URL of the selected user, or your own avatar.') //description of the command
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')), //add user option to target the user whose avatar you want to see
	async execute(interaction) {
		const user = interaction.options.getUser('target'); //get the targeted user
		if (user) return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL()}`); //if a user is targeted, reply with that user's avatar url
		return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL()}`); //if no user is targeted, reply with the author's avatar url
	},
};
