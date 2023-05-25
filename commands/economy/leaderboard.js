const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require("../../index");
const { Users } = require('../../dbObjects.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the leaderboard of top users.'),
  async execute(interaction, client) {
    const embed = new EmbedBuilder();

    // Fetch the top 5 users with the highest scores
    const topUsers = await Users.findAll({
      order: [['score', 'DESC']],
      limit: 5,
    });

    embed.setColor('#00ff00')
      .setTitle('Leaderboard');

    // Iterate through the top users and add their information to the embed
    const fields = [];
    for (let i = 0; i < topUsers.length; i++) {
      const user = topUsers[i];
      const userProfile = await client.users.fetch(user.user_id);
      const userName = userProfile.username;
      const userScore = user.score;

      // For the number one user, add their profile picture to the embed
      if (i === 0) {
        const userProfilePic = userProfile.displayAvatarURL();
        embed.setThumbnail(userProfilePic);
      }

      fields.push({
        name: `#${i + 1} - ${userName}`,
        value: `Score: ${userScore}`,
        inline: false,
      });
    }

    embed.addFields(fields);

    await interaction.reply({ embeds: [embed] });
  },
};
