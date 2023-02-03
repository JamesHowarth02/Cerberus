/*
    openai.js
    Allows the user to feed prompts into OpenAI.

    James Howarth
    2/22/2023

*/

const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const { openAPIKey } = require("../config.json");
const configuration = new Configuration({
  apiKey: openAPIKey,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  // SlashCommandBuilder instance
  data: new SlashCommandBuilder()
    .setName("openai")
    .setDescription(
      "Query an OpenAI model with your specified prompt! (ChatGPT not available yet!)"
    )
    .addStringOption((option) =>
      option
        .setName("model")
        .setDescription("OpenAI model to query, ChatGPT not available yet.")
        .setRequired(true)
        .addChoices(
          { name: "text-davinci-003 (default)", value: "text-davinci-003" },
          { name: "code-davinci-002", value: "code-davinci-002" },
          { name: "code-cushman-001", value: "code-cushman-001" },
          { name: "text-davinci-002", value: "text-davinci-002" },
          { name: "text-davinci-001", value: "text-davinci-001" },
          { name: "text-curie-001", value: "text-curie-001" },
          { name: "text-babbage-001", value: "text-babbage-001" },
          { name: "text-ada-001", value: "text-ada-001" },
          { name: "davinci-instruct-beta", value: "davinci-instruct-beta" },
          { name: "davinci", value: "davinci" },
          { name: "curie-instruct-beta", value: "curie-instruct-beta" },
          { name: "curie", value: "curie" },
          { name: "babbage", value: "babbage" },
          { name: "ada", value: "ada" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setRequired(true)
        .setDescription("Text to input into the model.")
    ),
  async execute(interaction) {
    // check if the interaction is a chat input command
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: true });

    const model = interaction.options.getString("model");
    const query = interaction.options.getString("prompt");

    const response = await openai.createCompletion({
      model: model,
      prompt: query,
      temperature: 0,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['"""'],
    });

    if (
      response &&
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      interaction.followUp({
        content:
          ":warning: **The following content was generated via OpenAI.**\n> **Model:** " +
          model +
          "\n> **Prompt:** " +
          query +
          "\n> **Response:** " +
          response.data.choices[0].text,
      });
    } else {
      interaction.followUp({
        content:
          ":warning: **The following content was generated via OpenAI.**\n> **Model:** " +
          model +
          "\n> **Prompt:** " +
          query +
          "\n> **Response: <OpenAI failed to respond to the given prompt.>",
      });
    }
  },
};
