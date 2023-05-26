const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjackhelp')
        .setDescription('Learn how to play blackjack.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2e8296')
            .setTitle('Blackjack Help')
            .setDescription('Welcome to the Blackjack game! Here\'s how it works:\n\n' +
                '🃏 The objective is to get a hand value as close to 21 as possible without exceeding it.\n' +
                '💰 Each card has a value: numbered cards 2-10 are their face value, face cards (J, Q, K) are 10, and the Ace can be 1 or 11.\n' +
                '👤 The dealer will deal you and themselves two cards each. You can see one of the dealer\'s cards.\n' +
                '🎮 Your goal is to draw additional cards ("hit") to improve your hand value or to keep your current hand value and not draw more cards ("stand").\n' +
                '💥 If your hand value exceeds 21, you "bust" and lose the round. If the dealer busts, you win the round.\n' +
                '🔍 The round ends when you decide to "stand," and the dealer reveals their hidden card and draws additional cards to try to beat your hand.\n' +
                '🏆 The winner is determined by comparing hand values. The hand closest to 21 without going over wins. In the case of a tie, it\'s a push.\n\n' +
                'Good luck and enjoy playing Blackjack!');

        await interaction.reply({ embeds: [embed] });
    },
};
