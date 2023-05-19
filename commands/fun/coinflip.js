const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin and returns either heads or tails'),
  async execute(interaction) {
    const rand = Math.random();
    let result;
    if(rand < 0.01) {
        result = 'its edge';
    }
    else {
        result = rand < 0.5 ? 'heads' : 'tails';
    }
    return interaction.reply(`The coin has been flipped and, behold, it landed on ${result}! Isn't the universe full of delightful randomness?`);
  },
};