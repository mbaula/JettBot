const { SlashCommandBuilder } = require('@discordjs/builders');


const sentinelAgents =  ['Cypher', 'Killjoy', 'Sage', 'Chamber'];
const duelistAgents = ['Jett', 'Phoenix', 'Raze', 'Reyna', 'Neon', 'Yoru'];
const initiatorAgents = ['Breach', 'Fade', 'Gekko', 'Kay-O', 'Skye', 'Sova'];
const controllerAgents =  ['Astra', 'Brimstone', 'Harbour', 'Omen', 'Viper'];

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
            { name: 'Any', value: 'any'},
        )),
    async execute(interaction) {
        const classOption = interaction.options.getString('agent-class');
        let agentList;
        if (classOption === 'sentinel') {
            agentList = sentinelAgents;
        } else if (classOption === 'duelist') {
            agentList = duelistAgents;
        } else if (classOption === 'initiator') {
            agentList = initiatorAgents;
        } else if (classOption === 'controller') {
            agentList = controllerAgents;
        } else {
            agentList = sentinelAgents.concat(duelistAgents, initiatorAgents, controllerAgents);
        }
        const randomIndex = Math.floor(Math.random() * agentList.length);
        const randomAgent = agentList[randomIndex];

        const rand = Math.random();
        if (rand <= 0.25) {
            return interaction.reply(`instalock ${randomAgent} to defeat`);
        }
        else if (rand > 0.25 && rand <= 0.5) {         
            return interaction.reply(`instalock ${randomAgent} to victory`);
        }
        else if (rand > 0.5 && rand <= 0.75) {
            return interaction.reply(`The stars have aligned, and you shall play: ${randomAgent}`);
        }
        else {
            return interaction.reply(`Your fate has been chosen, Boaster tells you to play: ${randomAgent}`);
        }
    },
};