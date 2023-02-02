/*
    assignmentModule.js
    Simple module to avoid copying and pasting.
    Returns an embed.

    James Howarth
    2/1/2023

*/

const { EmbedBuilder } = require("discord.js");
const googleSheetsFetcher = require("./sheets-helper.js");


module.exports = async function createAssignmentEmbed(dateChosen) {
  let assignmentArray;
  if (dateChosen === "Yesterday")
    assignmentArray = await googleSheetsFetcher.fetchYesterday();
  else if (dateChosen === "Today") {
    assignmentArray = await googleSheetsFetcher.fetchToday();
  } else {
    assignmentArray = await googleSheetsFetcher.fetchTomorrow();
  }

  const date = await googleSheetsFetcher.getSheetDate();
  const embed = new EmbedBuilder();
  embed.setColor(0x3498db);
  embed.setAuthor({
    name: "Cerberus for Homework",
    iconURL:
      "https://cdn.discordapp.com/avatars/523560415393742849/9ffe9a906bfe6e18fc2f6d034443e8ef.webp",
  });
  embed.setTitle(dateChosen + "'s Due Dates");
  embed.setThumbnail(
    "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f4da.png"
  );
  embed.setURL(
    "https://docs.google.com/spreadsheets/d/1qG28oJcWhqGYGNhCAML2xzKoSXxVjYURLtkGgCOGGRQ/edit#gid=1346304777"
  );
  embed.setDescription(
    "**" +
      dateChosen +
      "'s due dates, according to the spreadsheet.**\nPlease note that all due dates are sourced manually and may not be up-to-date."
  );
  embed.setTimestamp();
  embed.setFooter({
    text: `Cerberus for Homework | ` + date,
    iconURL:
      "https://cdn.discordapp.com/avatars/523560415393742849/9ffe9a906bfe6e18fc2f6d034443e8ef.webp",
  });

  // iterate through all the assignments
  let content = "";
  for (const className in assignmentArray) {
    content = ""; // wipe it for each class so they don't stack
    assignmentArray[className].forEach((assignment) => {
      content = content + `- ${assignment}\n`;
    });
    embed.addFields({ name: className, value: content, inline: true });
  }

  if (content === "") {
    embed.addFields({
      name: "Zero Assignments Found",
      value: "There are no reported assignments or tasks due on this date.",
      inline: true,
    });
  }

  return embed;
};
