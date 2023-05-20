const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get the profile picture of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get the profile picture from')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const avatarURL = user.avatarURL({ dynamic: true, size: 4096, format: 'png' });
        return interaction.reply(`Oh, I've got just the thing! Here is the marvelous profile picture of ${user.username}: ${avatarURL}`);
    },
};