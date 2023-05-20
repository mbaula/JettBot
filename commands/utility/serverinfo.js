const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display information about the server'),
  async execute(interaction) {
    const server = interaction.guild;

    // Get server information
    const serverName = server.name;
    const serverOwner = server.ownerId;
    const serverRegion = server.region;
    const memberCount = server.memberCount;
    const botCount = server.members.cache.filter(member => member.user.bot).size;
    const humanCount = memberCount - botCount;
    const serverCreationDate = server.joinedTimestamp ? new Date(server.joinedTimestamp).toDateString() : null;

    // Generate the server information message
    const serverInfoMessage = `
      **Server Name:** ${serverName}
      **Server Owner ID:** ${serverOwner}
      **Server Region:** ${serverRegion}
      **Member Count:** ${memberCount}
      **Human Members:** ${humanCount}
      **Bot Members:** ${botCount}
      **Server Creation Date:** ${serverCreationDate}
    `;

    return interaction.reply(serverInfoMessage);
  },
};
