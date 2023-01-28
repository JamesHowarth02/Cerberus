/*
    due.js
    Allows the user to specify if an assignment is due yesterday, today or tomorrow.

    James Howarth
    1/27/2023

*/

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const googleSheetsFetcher = require("./helpers/sheets-helper.js");

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
    let assignmentArray;
    if(dateChosen === "Yesterday")
      assignmentArray = await googleSheetsFetcher.fetchYesterday();
    else if(dateChosen === "Today") {
      assignmentArray = await googleSheetsFetcher.fetchToday();
    }else{
      assignmentArray = await googleSheetsFetcher.fetchTomorrow();
    }

    const date = await googleSheetsFetcher.getSheetDate();
    const embed = new EmbedBuilder();
    embed.setColor(0x3498db);
    embed.setAuthor({ name: "Cerberus for Homework",  iconURL: 'https://cdn.discordapp.com/avatars/523560415393742849/9ffe9a906bfe6e18fc2f6d034443e8ef.webp'});
    embed.setTitle(dateChosen + "'s Due Dates");
    embed.setThumbnail('https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f4da.png')
    embed.setURL("https://docs.google.com/spreadsheets/d/1qG28oJcWhqGYGNhCAML2xzKoSXxVjYURLtkGgCOGGRQ/edit#gid=1346304777");
    embed.setDescription("**" + dateChosen + "'s due dates, according to the spreadsheet.**\nPlease note that all due dates are sourced manually and may not be up-to-date.");
    embed.setTimestamp();
    embed.setFooter({text: `Cerberus for Homework | ` + date, iconURL: "https://cdn.discordapp.com/avatars/523560415393742849/9ffe9a906bfe6e18fc2f6d034443e8ef.webp",});

    // iterate through all the assignments
    let content = "";
    for (const className in assignmentArray) {
      assignmentArray[className].forEach((assignment) => {
        content += "- " + assignment + "\n";
      });
      embed.addFields({name: className, value: content, inline: true});
    }

    if(content === "") {
      embed.addFields({name: "Zero Assignments Found", value: "There are no reported assignments or tasks due on this date.", inline: true});
    }
    interaction.followUp({ embeds: [embed] });
  },
};
