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

        interaction.reply(`${challenger} and ${opponent} are battling it out...`);

        setTimeout(() => {
        // Randomly select a winner
        const winner = [challenger, opponent][Math.floor(Math.random() * 2)];
        interaction.followUp(`And the winner is... ${winner}!`);
        }, 2000);
    },
};