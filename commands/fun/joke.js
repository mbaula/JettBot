const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tells a random joke'),
  async execute(interaction) {
    try {
      const response = await fetch('https://official-joke-api.appspot.com/random_joke');
      const json = await response.json();
      const setup = json.setup;
      const punchline = json.punchline;
      const joke = `${setup} \n\n ${punchline}`;
      return interaction.reply(joke);
    } catch (error) {
      console.error(error);
      return interaction.reply('Oops! Something went wrong. Please try again later.');
    }
  },
};