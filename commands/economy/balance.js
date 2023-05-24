const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require("../../index");
const { Users } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Find out how much Valor Points a user has')
        .addUserOption(option =>
        option.setName('target')
            .setDescription('The user to check the balance for')
            .setRequired(true)),
    async execute(interaction, client) {
        const embed = new EmbedBuilder();
        const target = interaction.options.getUser('target');

        const user = await Users.findOne({ where: { user_id: target.id } });
        const balance = user ? user.balance : 0;

		embed.setColor('#ffdd57')
        .setTitle(`Balance for ${target.username}`)
        .setDescription(`${target} has ${balance} Valor Points! 💸`);

        return interaction.reply({ embeds: [embed] });
    },
};