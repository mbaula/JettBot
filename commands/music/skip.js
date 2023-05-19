const { EmbedBuilder, SlashCommandBuilder, VoiceChannel } = require('discord.js');
const client = require("../../index");
const { Options } = require('distube');

let activeVoiceChannel = null; // Store the active voice channel

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip a song."),
    async execute(interaction, client) {
    
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;
        
        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor('#FF0000').setDescription("You must be in a voice channel to execute music commands.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (activeVoiceChannel && activeVoiceChannel !== voiceChannel) {
            embed.setColor('#FF0000').setDescription(`You can't skip a song as the music player is active in a different voice channel: <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {

            if (!activeVoiceChannel) {
                activeVoiceChannel = voiceChannel; // Set the active voice channel
            }

            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor('#FF0000').setDescription("There is no active queue.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await queue.skip(voiceChannel);
            embed.setColor("#90EE90").setDescription("⏩ The song has been skipped.");
            return interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log(err);

            embed.setColor('#FF0000').setDescription("⛔ Something went wrong...");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
}