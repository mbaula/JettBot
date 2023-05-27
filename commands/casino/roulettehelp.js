const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roulettehelp')
    .setDescription('Learn how to play roulette and understand the rules.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#d12279')
      .setTitle('Roulette Help')
      .setDescription('Welcome to the Roulette game! Here\'s how it works:\n\n' +
        '🎲 The objective is to bet on the outcome of a roulette spin.\n' +
        '💰 You can place bets on specific numbers or choose a color (red or black).\n' +
        '🔴 Red numbers: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36\n' +
        '⚫ Black numbers: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35\n' +
        '🔄 After all bets are placed, the roulette wheel is spun, and a ball lands on a number.\n' +
        '💰 If your bet matches the outcome, you win!\n\n' +
        'Payouts:\n' +
        '💰 Betting on a color: If you bet on the correct color, you win double your bet amount.\n' +
        '💰 Betting on a number: If you bet on the correct number, you win 35 times your bet amount.\n\n' +
        '⚠️ Please note that roulette is a game of chance, and the outcomes are random.\n' +
        '💸 Be cautious with your bets and have fun playing Roulette!');

    await interaction.reply({ embeds: [embed] });
  },
};
