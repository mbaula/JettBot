const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available commands'),
  async execute(interaction) {
    const commands = interaction.client.commands;

    const commandList = commands.map(command => `- \`/${command.data.name}\` : ${command.data.description}`).join('\n');

    await interaction.reply(`**Available Commands:**\n${commandList}`);
  },
};
