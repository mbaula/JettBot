const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wholesomememe')
    .setDescription('Generate a random wholesome meme from Reddit.'),

  async execute(interaction) {
    try {
      const response = await fetch('https://www.reddit.com/r/wholesomememes/random/.json');
      const data = await response.json();
      const meme = data[0]?.data?.children[0]?.data;

      if (!meme) {
        return interaction.reply('Failed to fetch a meme. Please try again later.');
      }

      const title = meme.title;
      const image = meme.url_overridden_by_dest;
      const subreddit = meme.subreddit_name_prefixed;

      await interaction.reply({
        content: `**${title}**\n`,
        files: [image],
      });
    } catch (error) {
      console.error('Error occurred while fetching meme:', error);
      await interaction.reply('Failed to fetch a meme. Please try again later.');
    }
  },
};
