const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get information about')
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const icon = user.displayAvatarURL();
    const tag = user.tag;

    const embed = new EmbedBuilder()
      .setColor('#CC9911')
      .setAuthor({ name: tag, iconURL: icon })
      .setThumbnail(icon)
      .addFields(
        { name: 'Member', value: `${user}`, inline: false },
        { name: 'Roles', value: `${member.roles.cache.map(r => r).join(' ')}`, inline: false },
        { name: 'Joined Server', value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true },
        { name: 'Joined Discord', value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true },
        { name: 'Bot Account', value: `${user.bot ? 'Yes' : 'No'}`, inline: true },
        { name: 'Flags', value: `${user.flags.toArray().join(', ') || 'None'}`, inline: false }
      )
      .setFooter({ text: `User ID: ${user.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
