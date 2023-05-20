const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Read the GIFs from the text file
const filePath = path.join(__dirname, '..', '..', 'assets', 'gifs', 'punch.txt');
const gifUrls = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

// Function to get a random GIF URL from the array
function getRandomGifUrl() {
    return gifUrls[Math.floor(Math.random() * gifUrls.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('punch')
        .setDescription('Punch someone with a GIF!')
        .addUserOption(option =>
        option.setName('target')
            .setDescription('The target!')
            .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const target = interaction.options.getUser('target');

        // Generate a random GIF URL
        const gifUrl = getRandomGifUrl();

        const embed = new EmbedBuilder()
            .setColor('#CC9911')
            .setDescription(`👊 ${user} punches ${target}!`)
            .setImage(gifUrl);

        interaction.reply({ embeds: [embed] });
    },
};