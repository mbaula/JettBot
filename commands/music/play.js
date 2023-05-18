const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song!')
    .addStringOption(option =>
      option.setName('song_link')
        .setDescription('The song link')
        .setRequired(true)
    ),

  async execute(interaction) {

    const { options, member, guild, channel } = interaction;
    const song = interaction.options.getString('song_link');
    const voiceChannel = member.voice.channel;
    
    const embed = new EmbedBuilder();

    if (!voiceChannel) {
        embed.setColor('#FF0000').setDescription("You must be in a voice channel to execute music commands.");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
        embed.setColor('#8b02e0').setDescription(`You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {

        client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
        return interaction.reply({ content: "🎶 Request received." });

    } catch (err) {
        console.log(err);

        embed.setColor('#8b02e0').setDescription("⛔ | Something went wrong...");

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
