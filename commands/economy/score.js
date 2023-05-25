const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require("../../index");
const { Users } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('Find out a user\'s score')
        .addUserOption(option =>
        option.setName('target')
            .setDescription('The user to check the score for')
            .setRequired(true)),
    async execute(interaction, client) {
        const embed = new EmbedBuilder();
        const target = interaction.options.getUser('target');

        const user = await Users.findOne({ where: { user_id: target.id } });
        const score = user ? user.score : 0;

		embed.setColor('#ffdd57')
        .setTitle(`Score for ${target.username}`)
        .setDescription(`${target} has a score of ${score}!`)
        .setImage(`https://media.tenor.com/PuVmK7Ut1cQAAAAd/tenz-c9.gif`);

        return interaction.reply({ embeds: [embed] });
    },
};