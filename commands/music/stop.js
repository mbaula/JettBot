const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require("../../index");
const { Options } = require('distube');

let activeVoiceChannel = null; // Store the active voice channel

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the current playing song."),
    async execute(interaction, client) {
    
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;
        
        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor('#FF0000').setDescription("You must be in a voice channel to execute music commands.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {

            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor('#FF0000').setDescription("There is no active queue.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await queue.stop(voiceChannel);
            embed.setColor('#90EE90').setDescription("⏹ The queue has been stopped.");
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            embed.setColor('#FF0000').setDescription("⛔ Something went wrong...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
}