const { SlashCommandBuilder } = require('discord.js');
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer Valor Points to another user')
        .addUserOption(option =>
        option
            .setName('target')
            .setDescription('The user to transfer Valor Points to')
            .setRequired(true))
        .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('The amount of Valor Points to transfer')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const user = client.currency.get(interaction.user.id);
        const currentAmount = user ? user.dataValues.balance : 0;

        const transferAmount = interaction.options.getInteger('amount');
        const transferTarget = interaction.options.getUser('target');

        if (transferAmount > currentAmount) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount} Valor Points. Get your money up!`);
	    if (transferAmount <= 0) return interaction.reply(`Please enter an amount greater than zero, ${interaction.user} 🤦‍♀️.`);
        if (interaction.user.id === transferTarget.id) return interaction.reply(`You cannot transfer Valor Points to yourself. Nice try lil bro`);
        if (transferTarget.bot) return interaction.reply(`You cannot transfer Valor Points to a bot. They have no use for them! 🤦‍♀️`);

        user.dataValues.balance -= transferAmount;       
        client.currency.get(transferTarget.id).dataValues.balance += transferAmount;

        return interaction.reply(`Successfully transferred ${transferAmount} Valor Points to ${transferTarget}. Your current balance is ${currentAmount - transferAmount} 💰`);
    },
};