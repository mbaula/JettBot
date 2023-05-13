const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8ball a question')
        .addStringOption(option =>
        option.setName('question')
            .setDescription('The question to ask')
            .setRequired(true)),
    async execute(interaction) {
        const responses = [
            "Who cares?",
            "What's it to ya?",
            "Don't count on it.",
            "Outlook not so good.",
            "Ask me if I care.",
            "As if.",
            "In your dreams.",
            "Not a chance.",
            "You wish.",
            "Fat chance.",
            "I wouldn't bet on it.",
            "Like I care.",
            "Yeah, right.",
            "What do I look like, a genie?",
            "Ha! Yeah, right.",
            "No way, José.",
            "You gotta be kidding me.",
            "Not today, pal.",
            "I don't think so.",
            "As if I'd tell you."
        ];

        const question = interaction.options.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(`"${response}"`);
    },
};