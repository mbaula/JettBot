const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display available commands.'),
  async execute(interaction) {
    // Read all command folders from the commands directory
    const commandFolders = fs.readdirSync(path.join(__dirname, '..'));

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Command Categories');

    // Iterate through command folders
    for (const folder of commandFolders) {
      // Skip non-directory files
      if (!fs.statSync(path.join(__dirname, '..', folder)).isDirectory()) continue;

      const commandFiles = fs.readdirSync(path.join(__dirname, '..', folder));

      // Get command names and descriptions from each command file
      const commands = commandFiles.map(file => {
        const command = require(path.join(__dirname, '..', folder, file));
        return {
          name: command.data.name,
          description: command.data.description
        };
      });

      // Add command names and descriptions to the embed
      embed.addFields(
        { name: folder, value: commands.map(cmd => `\`${cmd.name}\`: ${cmd.description}`).join('\n') }
      );

    }

    await interaction.reply({ embeds: [embed] });
  },
};
