const { SlashCommandBuilder } = require('@discordjs/builders');
const SpotifyWebApi = require('spotify-web-api-node');
const { Player } = require('discord-player');
const { spotifyClientId, spotifySecretId } = require('../../config.json');

// Set up Spotify API credentials
const spotifyApi = new SpotifyWebApi({spotifyClientId, spotifySecretId});

// Set up Discord player
const player = new Player(client);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from a Spotify URL')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('The Spotify URL of the song to play')
        .setRequired(true)),
  async execute(interaction) {
    try {
      // Get the Spotify URL from the command input
      const url = interaction.options.getString('url');

      // Get the track ID from the Spotify URL
      const match = url.match(/track\/(.+)/);
      const trackId = match[1];

      // Authenticate with Spotify API
      const { body } = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(body.access_token);

      // Get the track details from Spotify API
      const track = await spotifyApi.getTrack(trackId);

      // Get the track preview URL
      const previewUrl = track.body.preview_url;

      // Play the track in the voice channel the user is in
      player.play(interaction.member.voice.channel, previewUrl);
      interaction.reply(`Now playing: ${track.body.name} by ${track.body.artists[0].name}`);
    } catch (error) {
      console.error(error);
      interaction.reply('Oops! Something went wrong. Please try again later.');
    }
  },
};
