const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('roulette')
      .setDescription('Play a game of roulette.')
      .addIntegerOption(option =>
        option.setName('amount')
          .setDescription('Amount of currency to bet.')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('color')
          .setDescription('Bet on the color of the roulette result.')
          .addChoices(
            { name: 'Black', value: 'black' },
            { name: 'Red', value: 'red' }
          )
          .setRequired(false))
      .addIntegerOption(option =>
        option.setName('number')
            .setDescription('Bet on a specific number in the roulette result.')
            .setRequired(false)),
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

                    const color = interaction.options.getString('color');
                    const number = interaction.options.getInteger('number');

                    if (!color && !number) {
                        return interaction.reply('You must place at least one valid bet (color or number).');
                    }

                    user.balance -= amount;
                    user.game_ongoing = true;
                    await user.save();

                    let outcome = '';
                    let win = false;

                    // Simulate the roulette spin
                    const result = Math.floor(Math.random() * 37); // Generate a random number between 0 and 36

                    const rouletteGIF = 'https://media4.giphy.com/media/26uflBhaGt5lQsaCA/giphy.gif'; 

                    // Evaluate color bet
                    if (color) {
                        const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(result);
                        const isBlack = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(result);
                
                        if ((color === 'red' && isRed) || (color === 'black' && isBlack)) {
                            outcome += 'You won the color bet!\n';
                            user.balance += amount * 2;
                            user.game_ongoing = false;
                            await user.save();
                        } else {
                            outcome += 'You lost the color bet.\n';
                            user.game_ongoing = false;
                            await user.save();
                        }
                    }

                    // Evaluate number bet
                    if (number) {
                        if (number < 0 || number > 36) {
                            user.game_ongoing = false;
                            await user.save();
                            return interaction.reply('Invalid number bet. Please choose a number between 0 and 36.');
                        }

                        if (number === result) {
                            outcome += 'You won the number bet!\n';
                            user.balance += amount * 35;
                            user.game_ongoing = false;
                            await user.save();
                        } else {
                            outcome += 'You lost the number bet.\n';
                            user.game_ongoing = false;
                            await user.save();
                        }
                    }

                    embed.setColor('#e96d03')
                    .setTitle('Roulette Spin')
                    .setDescription(`You landed on...`);

                    embed.setImage(rouletteGIF);
                    const reply = await interaction.reply({ embeds: [embed] });

                    await new Promise(resolve => setTimeout(resolve, 2000));

                    embed.setColor('#e96d03')
                    .setTitle('Roulette Result')
                    .setDescription(`The ball lands on ${result}. ${outcome} \n Your balance: ${user.balance} VP`);
                    
                    embed.setImage(`https://static.wikia.nocookie.net/valorant/images/0/08/Yikes_Spray.png/revision/latest/scale-to-width-down/250?cb=20210909112730`)

                    interaction.editReply({ embeds: [embed] });;
                } catch (error) {
                    console.error('An error occurred:', error);
                    user.balance += amount;
                    user.game_ongoing = false;
                }
            }          
  };