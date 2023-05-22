const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require("../../index");
const { Users } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Find out a user\'s inventory')
        .addUserOption(option =>
        option.setName('target')
            .setDescription('The user you want to find the inventory of')
            .setRequired(true)),
    async execute(interaction, client) {
        const embed = new EmbedBuilder();

        const target = interaction.options.getUser('target');
        const user = await Users.findOne({ where: { user_id: target.id }, attributes: ['user_id'] });

        const items = await user.getItems();

		if (!items.length) 
        {
            embed.setColor('#ffdd57')
            .setTitle(`${target.username}'s Inventory: `)
            .setDescription(`${target} has nothing! 💀`);

            return interaction.reply({ embeds: [embed] });
        }
        
        
        embed.setColor('#ffdd57')
            .setTitle(`${target.username}'s Inventory: `)
            .setDescription(`${target} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);

        return interaction.reply({ embeds: [embed] });
    },
};