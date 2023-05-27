const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');

// Define the symbols and their corresponding values
const symbols = ['🍒', '🍊', '🍇', '🔔', '💰'];
const symbolValues = {
    '🍒': 15,
    '🍊': 25,
    '🍇': 35,
    '🔔': 50,
    '💰': 75
  };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play the slot machine and gamble currency.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of currency to bet.')
        .setRequired(true)),
        async execute(interaction) {
          try {
            const embed = new EmbedBuilder();
            const amount = interaction.options.getInteger('amount');
              
            const user = await Users.findOne({ where: { user_id: interaction.user.id } });
            const balance = user ? user.balance : 0;
          
            if (balance < amount) {
              return interaction.reply("You don't have enough currency to place that bet.");
            }

            if (user.game_ongoing) {
              return interaction.reply("Please finish your previous game before starting a new one.");
            }

            user.balance -= amount;
            user.game_ongoing = true;
            await user.save();
          
            const reels = Array.from({ length: 3 }, () => '?');

            embed.setColor('#00ff00')
            .setTitle('Rolling...')
            .setDescription(`[${reels.join('][')}]\nRolling...`);

            await interaction.reply({ embeds: [embed] });
          
            // Delay for each reel roll
            const delay = 1000;
            const rolls = 3;
          
            for (let i = 0; i < rolls; i++) {
              await new Promise(resolve => setTimeout(resolve, delay));
              reels[i] = symbols[Math.floor(Math.random() * symbols.length)];
              embed.setColor('#00ff00')
                .setTitle('Rolling...')
                .setDescription(`[${reels.join('][')}]\nRolling...`);
              interaction.editReply({ embeds: [embed] });
            }
          
            const uniqueSymbols = new Set(reels);
            const matchedSymbol = uniqueSymbols.size === 1 ? Array.from(uniqueSymbols)[0] : null;
            const payout = matchedSymbol ? symbolValues[matchedSymbol] * amount : 0;
            
            user.balance += payout;
            user.game_ongoing = false;
            await user.save();
          
            const resultString = reels.join(' ');
            const outcome = matchedSymbol ? `You won ${payout} VP!` : 'You lost. Better luck next time!';
            const newBalance = user.balance;
            
            embed.setColor('#00ff00')
            .setTitle('Results')
            .setDescription(`[${resultString}]\n${outcome}\nYour balance: ${newBalance} VP`);

            interaction.editReply({ embeds: [embed] });
          } catch (error) {
            console.error('An error occurred:', error);
            user.balance += amount;
            user.game_ongoing = false;
          }
        }          
};
