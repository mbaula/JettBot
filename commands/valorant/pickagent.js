const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

const agents = {
  sentinel: {
    list: ['Cypher', 'Killjoy', 'Sage', 'Chamber'],
    gifUrls: [
      'https://media.tenor.com/s2koS0KpBHAAAAAC/be-my-guest-cypher.gif',
      'https://media.tenor.com/edAuJFL3onEAAAAC/valorant-petkilljoy.gif',
      'https://i.imgflip.com/708n2y.gif',
      'https://media.tenor.com/K7WqPQnzSQUAAAAd/teleport-chamber.gif'
    ]
  },
  duelist: {
    list: ['Jett', 'Phoenix', 'Raze', 'Reyna', 'Neon', 'Yoru'],
    gifUrls: [
      'https://media.tenor.com/XdidvlKOOssAAAAd/jett-valorant.gif',
      'https://media.tenor.com/Uq-SVR1TOIcAAAAC/attack-with-superpower-phoenix.gif',
      'https://media.tenor.com/mVmgrmhBgJoAAAAC/raze-valorant.gif',
      'https://media.tenor.com/CixSE2rNU_UAAAAd/valorant.gif',
      'https://media.tenor.com/2TNSiXofAykAAAAd/valorant-valorant-neon.gif',
      'https://media.tenor.com/ymoOfPitkOcAAAAC/valorant-yoru.gif'
    ]
  },
  initiator: {
    list: ['Breach', 'Fade', 'Gekko', 'Kay-O', 'Skye', 'Sova'],
    gifUrls: [
      'https://media.tenor.com/idaskd16WuUAAAAd/community-gaming-cgny.gif',
      'https://media.tenor.com/EP5O9v8b6xkAAAAd/valorant-fade.gif',
      'https://media.tenor.com/505HEISmW_MAAAAd/summoning-the-creature-gekko.gif',
      'https://media.tenor.com/TMEpyWcdm_YAAAAd/kayo-valorant.gif',
      'https://media.tenor.com/yxJfOd5sflQAAAAC/valorant-skye.gif',
      'https://media.tenor.com/pfNncrwc_SUAAAAC/sova-valorant.gif'
    ]
  },
  controller: {
    list: ['Astra', 'Brimstone', 'Harbour', 'Omen', 'Viper'],
    gifUrls: [
      'https://gifdb.com/images/thumbnail/valorant-agent-teaser-astra-bx54xn48vedo1cls.gif',
      'https://media.tenor.com/SIpb09gaKfYAAAAC/brimbom-valorant.gif',
      'https://media.tenor.com/EFp05Ko6QrcAAAAd/reaching-for-something-harbor.gif',
      'https://media.tenor.com/WcD6euyUl8oAAAAC/omen-valorant-valorant.gif',
      'https://media.tenor.com/8eX8yS6-O5sAAAAC/valorant-come.gif'
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pick-agent')
    .setDescription('Picks a random agent from the specified class')
    .addStringOption(option =>
      option.setName('agent-class')
        .setDescription('The class of agents to choose from')
        .setRequired(true)
        .addChoices(
          { name: 'Sentinel', value: 'sentinel' },
          { name: 'Duelist', value: 'duelist' },
          { name: 'Controller', value: 'controller' },
          { name: 'Initiator', value: 'initiator' },
          { name: 'Any', value: 'any' },
        )),
  async execute(interaction) {
    const embed = new EmbedBuilder();
    const classOption = interaction.options.getString('agent-class');
    let agentList, gifUrls;
    if (classOption === 'sentinel') {
      agentList = agents.sentinel.list;
      gifUrls = agents.sentinel.gifUrls;
    } else if (classOption === 'duelist') {
      agentList = agents.duelist.list;
      gifUrls = agents.duelist.gifUrls;
    } else if (classOption === 'initiator') {
      agentList = agents.initiator.list;
      gifUrls = agents.initiator.gifUrls;
    } else if (classOption === 'controller') {
      agentList = agents.controller.list;
      gifUrls = agents.controller.gifUrls;
    } else {
      agentList = agents.sentinel.list
        .concat(agents.duelist.list, agents.initiator.list, agents.controller.list);
      gifUrls = agents.sentinel.gifUrls
        .concat(agents.duelist.gifUrls, agents.initiator.gifUrls, agents.controller.gifUrls);
    }

    const randomIndex = Math.floor(Math.random() * agentList.length);
    const randomAgent = agentList[randomIndex];
    const agentGifUrl = gifUrls[randomIndex];

    embed.setColor(0x00ff00)
    .setTitle('Agent Roulette Results:')

    const rand = Math.random();
    if (rand <= 0.25) {
        embed.setDescription(`Instalock ${randomAgent} to defeat. There's definitely gonna be smurfs on the enemy team.`);
    } else if (rand > 0.25 && rand <= 0.5) {
        embed.setDescription(`Instalock ${randomAgent} to victory. You will bottomfrag but at least you'll win!`);
    } else if (rand > 0.5 && rand <= 0.75) {
        embed.setDescription(`The stars have aligned, and you shall play: ${randomAgent}`);
    } else {
        embed.setDescription(`Your fate has been chosen, Boaster tells you to play: ${randomAgent}`);
    }
    embed.setImage(agentGifUrl);
    await interaction.reply({ embeds: [embed] });
  },
};