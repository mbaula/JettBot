const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8ball Janet a question')
        .addStringOption(option =>
        option.setName('question')
            .setDescription('The question to ask')
            .setRequired(true)),
    async execute(interaction) {
        const responses = [
            "Sure thing, it's a lock",
            "No doubts, buddy",
            "You can bank on it, no question",
            "Absolutely, 100% certainty",
            "No room for debate, it's a yes",
            "Yeah, from my perspective, definitely",
            "If you ask me, chances are high",
            "Affirmative, no doubt about it",
            "The outlook is rock solid",
            "All signs scream yes, without a doubt",
            "Got a bit of haze, try again",
            "Can't give it away just yet, my friend",
            "Ask me later, maybe I'll have something",
            "No fortune-telling right now",
            "Focus up and ask again, maybe then I'll know",
            "Don't hold your breath, it's a no-go",
            "Outlook's not pretty, gotta keep it real",
            "My sources are a hard no",
            "Doubtful, seriously doubtful",
            "No way around it, it's a firm no",

        ];

        const question = interaction.options.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(`You asked: "${question}" \n\n **JettBot: ${response}**`);
    },
};

