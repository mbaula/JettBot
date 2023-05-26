const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rockpaperscissors')
    .setDescription('Play Rock, Paper, Scissors and wager a bet.')
    .addStringOption(option =>
      option.setName('move')
        .setDescription('Your move: rock, paper, or scissors.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('How much are you willing to lose 😈')
        .setRequired(true)),

  async execute(interaction) {
    const embed = new EmbedBuilder();

    // Retrieve user's move and bet amount
    const move = interaction.options.getString('move').toLowerCase();
    const bet = interaction.options.getInteger('amount');

    const user = await Users.findOne({ where: { user_id: interaction.user.id } });
    const balance = user ? user.balance : 0;

    if (balance < bet) {
        return interaction.reply("You don't have enough currency to place that bet.");
    }

    if (!['rock', 'paper', 'scissors'].includes(move)) {
      return interaction.reply('Invalid move. Please choose rock, paper, or scissors.');
    }

    if (bet <= 0) {
      return interaction.reply('Invalid bet amount. Please enter a positive number.');
    }

    user.balance -= bet;

    // Define the moves and their hierarchy
    const moves = ['rock', 'paper', 'scissors', 'dragon warrior kung fu god smurf'];
    const moveHierarchy = {
      'rock': ['scissors'],
      'paper': ['rock'],
      'scissors': ['paper'],
      'dragon warrior kung fu god smurf': ['rock', 'paper', 'scissors']
    };

    // Simulate the opponent's move
    let opponentMove;
    const random = Math.random();
    if (random <= 0.02) {
      opponentMove = 'dragon warrior kung fu god smurf';
    } else {
      opponentMove = moves[Math.floor(Math.random() * 3)];
    }

    // Determine the outcome
    let outcome;
    if (move === opponentMove) {
      outcome = 'It\'s a tie!';
      user.balance += bet;
      payout = 0;
    } else if (moveHierarchy[move].includes(opponentMove)) {
      outcome = 'You win!';
      user.balance += bet * 2;
      payout = bet * 2;
    } else {
      outcome = 'You lose!';
      payout = -bet;
    }

    await user.save();

    embed.setColor('#2e8296')
      .setTitle('Rock, Paper, Scissors')
      .setDescription(`You chose **${move}**.\nThe opponent chose **${opponentMove}**.\n\n${outcome}\n\nYour payout: ${payout}`);

    interaction.reply({ embeds: [embed] });
  }
};
