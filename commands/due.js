/*
    due.js
    Allows the user to specify if an assignment is due yesterday, today or tomorrow.

    James Howarth
    1/27/2023

*/

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const createAssignmentEmbed = require("./helpers/assignment-module.js");

module.exports = {
  // SlashCommandBuilder instance 
  data: new SlashCommandBuilder()
    .setName("due")
    .setDescription("Summarizes a list of what is due on the specified day.")
    .addStringOption(option =>
      option.setName('date-chosen')
        .setDescription('Specified date to query.')
        .setRequired(true)
        .addChoices(
          { name: 'Yesterday', value: 'Yesterday' },
          { name: 'Today', value: 'Today' },
          { name: 'Tomorrow', value: 'Tomorrow' },
        )),
  async execute(interaction) {
    // check if the interaction is a chat input command
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: true });
    
    const dateChosen = interaction.options.getString('date-chosen');
    const embed = await createAssignmentEmbed(dateChosen);

    interaction.followUp({ embeds: [embed] });
  },
};
