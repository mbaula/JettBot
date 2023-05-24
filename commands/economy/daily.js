const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily VP bonus'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const embed = new EmbedBuilder();

        // Check if the user has already claimed their daily bonus today
        const user = await Users.findOne({ where: { user_id: userId } });
        if (user.last_claimed_daily) {
            // Check if it's a new day by comparing the dates
            const today = new Date();
            const lastClaimedDate = user.last_claimed_daily;
            if (
                today.getUTCFullYear() === lastClaimedDate.getUTCFullYear() &&
                today.getUTCMonth() === lastClaimedDate.getUTCMonth() &&
                today.getUTCDate() === lastClaimedDate.getUTCDate()
            ) {
                // The user has already claimed their daily bonus today
                await interaction.reply('You have already claimed your daily bonus. Please try again tomorrow.');
                return;
            }
        }

        user.balance += 160;

        // Update the user's last_claimed_daily field to today's date
        user.last_claimed_daily = new Date();
        await user.save();

        embed.setColor('#00ff00')
                .setTitle('Daily Claim')
                .setDescription(`Congratulations! You have \nclaimed your daily bonus of **160 VP**.`)
                .setImage(`https://media.tenor.com/omzcVsxSIVIAAAAd/marved-tiktok.gif`);

        const reply = await interaction.reply({ embeds: [embed] });

        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Edit the original reply to remove the image
        embed.setImage('https://pbs.twimg.com/media/Ez7a3GZWYAMMm2E.jpg');
        interaction.editReply({ embeds: [embed] });
    },
};