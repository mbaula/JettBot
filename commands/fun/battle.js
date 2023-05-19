const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('battle')
        .setDescription('Challenge someone to a battle')
        .addUserOption(option =>
        option.setName('opponent')
            .setDescription('The user to challenge')
            .setRequired(true)),
    async execute(interaction) {
        const challenger = interaction.user;
        const opponent = interaction.options.getUser('opponent');

        interaction.reply(`Alrighty then! ${challenger} and ${opponent} are about to engage in a battle...`);

        setTimeout(() => {
        // Randomly select a winner
        const winner = [challenger, opponent][Math.floor(Math.random() * 2)];
        interaction.followUp(`And the winner is... drumroll, please... ${winner}! Not that it matters, but it's always fun to see who wins.`);
        }, 2000);
    },
};