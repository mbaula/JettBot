const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin and returns either heads or tails')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of VP to bet')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('guess')
        .setDescription('Your guess: heads or tails')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }    
      )
    ),
    async execute(interaction) {
      try {
        const embed = new EmbedBuilder();
        const amount = interaction.options.getInteger('amount');
        const guess = interaction.options.getString('guess');
    
        if (amount < 0) {
          return interaction.reply('Please enter a valid amount of VP to bet.');
        }
    
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        const balance = user ? user.balance : 0;
    
        if (balance < amount) {
          return interaction.reply("You don't have enough VP to place that bet.");
        }
    
        const coinFlipGIF = 'https://media.tenor.com/bd3puNXKLwUAAAAC/coin-toss.gif'; 
        const headsCoinImage = 'https://www.shutterstock.com/image-vector/man-head-profile-golden-coin-260nw-781930996.jpg'; 
        const tailsCoinImage = 'https://us.123rf.com/450wm/spideyspike/spideyspike2007/spideyspike200700006/151874716-the-tail-side-of-the-coin-isolated-vector-illustration.jpg?ver=6';
         
        const rand = Math.random();
        let result;
        let coinImage;
    
        if (rand < 0.01) {
          result = 'its edge';
        } else {
          result = rand < 0.5 ? 'heads' : 'tails';
        }
    
        let outcome;
    
        if (result === guess) {
          outcome = `Congratulations! It's ${result}! You won ${amount * 2} VP!`;
          user.balance += amount * 2;
          coinImage = result === 'heads' ? headsCoinImage : tailsCoinImage;
        } else {
          outcome = `Sorry! It's ${result}. You lost ${amount} VP nt!`;
          user.balance -= amount;
          coinImage = result === 'heads' ? headsCoinImage : tailsCoinImage;
        }
    
        await user.save();

        embed.setColor('#00ff00')
        .setTitle('Coin Flip Result')
        .setDescription(`You flipped ...`);

        embed.setImage(coinFlipGIF);
        const reply = await interaction.reply({ embeds: [embed] });

        await new Promise(resolve => setTimeout(resolve, 2000));
    
        embed.setTitle('Coin Flip Result')
        .setDescription(`${outcome}`)
        .setImage(coinImage);

        interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('An error occurred:', error);
      }
  }
};
