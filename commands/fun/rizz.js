const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('rizz')
      .setDescription('Jett rates your rizz!')
      .addUserOption(option => (
        option.setName('user')
          .setDescription('The user to rate')
          .setRequired(true)
      )),
    async execute(interaction) {
      // Get the user mentioned in the command
      const user = interaction.options.getUser('user');
  
      // Generate a random rating between 1 and 10
      const rating = Math.floor(Math.random() * 12) + 1;
  
      // Generate the response message with the rating and the mentioned user's name
      if (rating <= 10) {
        const response = `${user}'s @ has ${rating}/10 rizz. There's always room for improvement, right?`;
        return interaction.reply(response);
      } else if (rating === 11) {
        const response = `${user}'s @ has L rizz! 🤮`;
        return interaction.reply(response);
      } else {
        const response = `${user}'s @ has UNLIMITED rizz! 🔥🔥🔥`;
        return interaction.reply(response);
      }
    },
  };