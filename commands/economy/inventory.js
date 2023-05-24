const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require("../../index");
const { Users, UserItems } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription("Find out a user's inventory")
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to find the inventory of')
                .setRequired(true)),
    async execute(interaction, client) {
        const embed = new EmbedBuilder();

        const target = interaction.options.getUser('target');
        const user = await Users.findOne({ where: { user_id: target.id } });

        const items = await UserItems.findAll({ where: { user_id: target.id }, include: ['item'] });

        if (!items.length) {
            embed.setColor('#ffdd57')
                .setTitle(`${target.username}'s Inventory`)
                .setDescription(`${target} has nothing! 💀`);

            return interaction.reply({ embeds: [embed] });
        }

        items.sort((a, b) => b.starLevel - a.starLevel); // Sort items based on starLevel in descending order

        const inventoryMap = new Map();
        for (const item of items) {
            const starLevel = item.starLevel;
            const itemName = item.skinName;
            const itemQuantity = item.amount;
            if (inventoryMap.has(starLevel)) {
                inventoryMap.get(starLevel).push({ name: itemName, quantity: itemQuantity });
            } else {
                inventoryMap.set(starLevel, [{ name: itemName, quantity: itemQuantity }]);
            }
        }

        let description = '';
        inventoryMap.forEach((skins, starLevel) => {
            description += `**${starLevel}★ skins:**\n`;
            skins.forEach(skin => {
                description += `${skin.quantity}x ${skin.name}\n`;
            });
            description += '\n';
        });

        embed.setColor('#ffdd57')
            .setTitle(`${target.username}'s Inventory`)
            .setDescription(`\n${description}`);

        return interaction.reply({ embeds: [embed] });
    },
};
