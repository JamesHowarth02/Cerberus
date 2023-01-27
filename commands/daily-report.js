/*
    daily-report.js
    Returns a list of items due today, according to the spreadsheet.

    James Howarth
    1/27/2023

*/

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const googleSheetsFetcher = require("./helpers/sheets-helper.js");

module.exports = {
  // SlashCommandBuilder instance 
  data: new SlashCommandBuilder()
    .setName("daily-report")
    .setDescription("Summarizes a list of what is due today."),
  async execute(interaction) {
    // check if the interaction is a chat input command
    if (!interaction.isChatInputCommand()) return;
    // defer the reply with ephemeral true
    await interaction.deferReply({ ephemeral: true });
    // fetch today's assignments from google sheets
    const assignmentArray = await googleSheetsFetcher.fetchToday();
    // get the current date
    const date = await googleSheetsFetcher.getSheetDate();
    // create a new embed builder instance
    const embed = new EmbedBuilder();
    // set the color of the embed
    embed.setColor(0x3498db);
    // set the author of the embed
    embed.setAuthor({ name: "Cerberus for Homework",  iconURL: 'https://cdn.discordapp.com/avatars/523560415393742849/9ffe9a906bfe6e18fc2f6d034443e8ef.webp'});
    // set the title of the embed
    embed.setTitle("Today's Due Dates -- " + date);
    // set the thumbnail of the embed
    embed.setThumbnail('https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f4da.png')
    // set the url of the embed
    embed.setURL("https://docs.google.com/spreadsheets/d/1qG28oJcWhqGYGNhCAML2xzKoSXxVjYURLtkGgCOGGRQ/edit#gid=1346304777");
    // set the description of the embed
    embed.setDescription("Today's due dates, according to the spreadsheet. Please note that all due dates are sourced manually and may not be up-to-date.");
    // set the timestamp of the embed
    embed.setTimestamp();
    // set the footer of the embed
    embed.setFooter({text: `Cerberus for Homework`, iconURL: "https://cdn.discordapp.com/avatars/523560415393742849/9ffe9a906bfe6e18fc2f6d034443e8ef.webp",});

    // iterate through all the assignments
    for (const className in assignmentArray) {
      let content = "";
      //iterate through all the assignments of a class
      assignmentArray[className].forEach((assignment) => {
        content += "- " + assignment + "\n";
      });
      // add the fields to the embed
      embed.addFields({name: className, value: content, inline: true});
    }
    // follow up with the embed
    interaction.followUp({ embeds: [embed] });
  },
};
