const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioResource, StreamType, AudioPlayerStatus, createAudioPlayer } = require('@discordjs/voice');
const { getTracks } = require('spotify-url-info');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a Spotify track from a URL')
    .addStringOption(option => option.setName('url').setDescription('The Spotify track URL').setRequired(true)),
  async execute(interaction) {
    const url = interaction.options.getString('url');
    const trackInfo = await getTracks(url);
    const trackTitle = trackInfo.name;

    if (!trackInfo || trackInfo.type !== 'track') {
      await interaction.reply('Invalid Spotify track URL provided.');
      return;
    }

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply('You need to be in a voice channel to use this command.');
      return;
    }

    const player = createAudioPlayer();
    const resource = createAudioResource(trackInfo.preview_url, { inputType: StreamType.Arbitrary });
    player.play(resource);

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);

    await interaction.reply(`Now playing "${trackTitle}" in ${voiceChannel.name}`);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  },
};
