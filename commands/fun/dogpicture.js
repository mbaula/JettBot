const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dogpicture')
        .setDescription('Get a random dog picture'),
    async execute(interaction) {
        try {
            const response = await fetch('https://placedog.net/640/480?random');
            const buffer = await response.buffer();
            
            // Send the dog picture as a file attachment
            return interaction.reply({ files: [buffer] });
        } catch (error) {
            console.error(error);
            return interaction.reply("Oops! Something went wrong. Please try again later.");
        }
    },
};
