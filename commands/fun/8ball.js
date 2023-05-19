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
            "Everything is fine. Like, seriously fine.",
            "Oh, forking sure!",
            "Definitely! It's like, not even a question.",
            "Absolutely! I got you, friend-o.",
            "You can count on it. I'm basically a database of everything.",
            "As an all-knowing being, I say yes.",
            "Most likely. But remember, there's no guarantees in the afterlife.",
            "Outlook looks pretty shiny from here.",
            "Yes, I'm so sure it's giving me a good place warm fuzzy feeling.",
            "All signs point to yes, and my knowledge is flawless.",
            "Oh, sorry! My answer is a little unclear right now. Ask again, maybe?",
            "I need to calculate that one. Ask me again later, okay?",
            "I can't give you a straight answer. It's complicated, like human ethics.",
            "Hmm, I don't have enough data to predict that. Ask another question, maybe?",
            "Concentrate, ask again, and I'll try to pull it up from the good place archives.",
            "Don't count on it. Seriously, don't.",
            "My reply is no, and I'm never wrong. Well, maybe just once or twice.",
            "My cosmic sources say absolutely not. Trust me on this one.",
            "Outlook is not so great. Sorry, dude.",
            "Very doubtful. Like, next to impossible doubtful."
        ];

        const question = interaction.options.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(`"${response}"`);
    },
};