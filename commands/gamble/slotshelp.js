const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
    .setName('slotshelp')
    .setDescription('Learn how to play slots and understand the odds of winning.'),
async execute(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#d12279')
        .setTitle('Slots Help')
        .setDescription('Welcome to the Slots game! Here\'s how it works:\n\n' +
            '🎰 The objective is to get matching fruit symbols on the slot machine reels.\n' +
            '💰 Each symbol has a different value, and your payout depends on the combination.\n' +
            '❓ The slot machine starts with three mystery symbols (?), which will be revealed after spinning.\n\n' +
            'Symbol Values:\n' +
            '🍒 Cherry: 15x your betting amount\n' +
            '🍊 Orange: 25x your betting amount\n' +
            '🍇 Grape: 35x your betting amount\n' +
            '🔔 Bell: 50x your betting amount\n' +
            '💰 Money Bag: 75x your betting amount\n\n' +
            'Odds of Winning:\n' +
            'The odds of winning are 1 in 125. So, each spin has a 1/125 chance of resulting in a winning combination.\n\n' +
            'Good luck and have fun playing Slots!');

    await interaction.reply({ embeds: [embed] });
    },
};
