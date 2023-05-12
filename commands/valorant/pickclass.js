const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pick-class')
    .setDescription('Picks a random Valorant agent class.'),
  async execute(interaction) {
    const classes = ['duelist', 'sentinel', 'initiator', 'controller'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    if(randomClass === 'duelist') {
        return interaction.reply(`Why are all my teammates baiting me?!! Be a bottom frag duelist!`);
    }
    else if(randomClass ==='sentinel') {
        return interaction.reply(`res me heal me wall for me you're a sentinel!`);
    }
    else if(randomClass === 'initiator') {
        return interaction.reply(`flash your teammates hueheuheuhheuhheuhheuhheuhheuhheuhhe, play initiator`);
    }
    else {
        return interaction.reply(`SMOKE THIS BabyRage SMOKE THAT BabyRage PLAY Controller!`);
    }
  },
};