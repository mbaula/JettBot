const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rollhelp')
    .setDescription('Learn how to use the roll command.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#d12279')
      .setTitle('Roll Help')
      .setDescription('To roll for a weapon skin, use the `/roll` command.\n\n' +
        'This command allows you to try your luck and obtain a random weapon skin for your collection.\n\n' +
        'Usage: `/roll`\n\n' +
        'Requirements:\n' +
        '💰 The roll command costs 160 Valor Points.\n' +
        '💰 You must have at least 160 Valor Points in your balance to use the command.\n\n' +
        'Outcome:\n' +
        '🔮 After using the `/roll` command, a loading animation will be displayed.\n' +
        '⌛ After a short delay, the result of your roll will be revealed.\n' +
        '💥 You will receive a weapon skin of a specific star level (1★ to 5★).\n' +
        '💥 The skin will be randomly chosen from the available skins for that star level.\n' +
        '💥 The name and image of the obtained skin will be displayed in the result.\n\n' +
        'Have fun rolling for weapon skins!'
      );

    await interaction.reply({ embeds: [embed] });
  },
};
