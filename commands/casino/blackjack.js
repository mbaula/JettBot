const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');

// Create a deck of cards
function createDeck() {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const deck = [];
  
    for (const suit of suits) {
      for (const rank of ranks) {
        const card = {
          rank,
          suit,
          name: `${rank}${suit}`,
        };
        deck.push(card);
      }
    }
  
    return deck;
}

// Draw a card from the deck
function drawCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
}

// calculate the value of a hand
function calculateHandValue(hand) {
    let handValue = 0;
    let hasAce = false;
  
    for (const card of hand) {
      if (card.rank === 'A') {
        handValue += 11;
        hasAce = true;
      } else if (card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') {
        handValue += 10;
      } else {
        handValue += parseInt(card.rank);
      }
    }
  
    // Adjust the value if there is an Ace in the hand
    if (handValue > 21 && hasAce) {
      handValue -= 10;
    }
  
    return handValue;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of blackjack and gamble some VP.')
        .addIntegerOption(option =>
    option.setName('amount')
        .setDescription('How much are you willing to lose 😈')
        .setRequired(true)),
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder();

            const amount = interaction.options.getInteger('amount');

            if (amount < 0) {
            return interaction.reply('Please enter a valid amount to bet.');
            }

            const user = await Users.findOne({ where: { user_id: interaction.user.id } });
            const balance = user ? user.balance : 0;

            if (balance < amount) {
                return interaction.reply("You don't have enough currency to place that bet.");
            }

            if(user.game_ongoing === true) {
                return interaction.reply("Please finish your previous game before starting a new one. You scammer :/");
            }

            user.game_ongoing = true;
            user.balance -= amount;
            await user.save();

            // Blackjack logic
            const deck = createDeck();
            const playerHand = [];
            const dealerHand = [];

            // Deal initial cards
            playerHand.push(drawCard(deck));
            dealerHand.push(drawCard(deck));
            playerHand.push(drawCard(deck));

            // Display initial hands
            let playerHandValue = calculateHandValue(playerHand);
            let dealerHandValue = calculateHandValue(dealerHand);
            let playerCardsString = playerHand.map(card => card.name).join(', ');
            let dealerCardsString = dealerHand.map(card => card.name).join(', ');

            embed.setTitle('You vs. Dealer')
            .setColor('#CC9911')
            .setDescription(`Your hand: ${playerCardsString} (Total: ${playerHandValue})\nDealer's hand: ${dealerCardsString} (Total: ${dealerHandValue}) \n\n Please type 'hit' or 'stand' to continue.`);

            await interaction.reply({ embeds: [embed] });

            let playerTurn = true;
            let gameOver = false;

            while (playerTurn && !gameOver) {
                const filter = m => m.author.id === interaction.user.id;
                const response = await interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ['time'],
                });

                const choice = response.first().content.toLowerCase();
        
                if (choice === 'stand') {
                playerTurn = false;
                } else if (choice === 'hit') {
                    playerHand.push(drawCard(deck));
                    const handValue = calculateHandValue(playerHand);

                    if (handValue > 21 || handValue === 21) {
                        gameOver = true;
                        await interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`You drew: ${playerHand[playerHand.length - 1].name}`)
                                .setColor('#CC9911')
                                .setDescription(`Your hand: ${playerCardsString} (Total: ${handValue})\nDealer's hand: ${dealerCardsString} (Total: ${dealerHandValue}) \n\n Please type 'hit' or 'stand' to continue.`)
                            ]
                        });
                        break;
                    }

                    playerCardsString = playerHand.map(card => card.name).join(', ');
                    
                    await interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`You drew: ${playerHand[playerHand.length - 1].name}`)
                            .setColor('#CC9911')
                            .setDescription(`Your hand: ${playerCardsString} (Total: ${handValue})\nDealer's hand: ${dealerCardsString} (Total: ${dealerHandValue}) \n\n Please type 'hit' or 'stand' to continue.`)
                        ]
                    });
                } else {
                    await interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`Invalid choice. Please type either "hit" or "stand".`)
                            .setColor('#CC9911')
                        ]
                    });
                }   
            }

            // Dealer's turn
            while (!playerTurn && !gameOver) {
                const dealerHandValue = calculateHandValue(dealerHand);
        
                if (dealerHandValue < 17) {
                    dealerHand.push(drawCard(deck));
                    dealerCardsString = dealerHand.map(card => card.name).join(', ');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`Dealer drew: ${dealerHand[dealerHand.length - 1].name}`)
                            .setColor('#CC9911')
                            .setDescription(`Your hand: ${playerCardsString} (Total: ${playerHandValue})\nDealer's hand: ${dealerCardsString} (Total: ${calculateHandValue(dealerHand)})`)
                        ]
                    });
                } else {
                break;
                }
            }

            // Calculate final hand values
            playerHandValue = calculateHandValue(playerHand);
            dealerHandValue = calculateHandValue(dealerHand);

            // Determine the winner
            if (playerHandValue === 21) {
                result = `You win with a Blackjack! You win ${amount * 2.5} VP!`;
                user.balance += amount * 2.5; // Adjust the amount won for a Blackjack as desired
            } else if (playerHandValue > 21) {
                result = `You bust. Dealer wins. You lost ${amount} VP! nt lil bro!`;
            } else if (dealerHandValue > 21) {
                result = `Dealer busts. You win ${amount * 2} VP!`;
                user.balance += amount * 2;
            } else if (playerHandValue > dealerHandValue) {
                result = `You win ${amount * 2} VP!`;
                user.balance += amount * 2;
            } else if (playerHandValue < dealerHandValue) {
                result = `Dealer wins. You lost ${amount} VP rekt!`;
            } else {
                result = 'It\'s a tie.';
                user.balance += amount;
            }

            user.game_ongoing = false;
            await user.save();

            // Display the final result
            playerCardsString = playerHand.map(card => card.name).join(', ');
            dealerCardsString = dealerHand.map(card => card.name).join(', ');

            await new Promise(resolve => setTimeout(resolve, 2000));

            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Result: ${result}`)
                    .setColor('#2e8296')
                    .setDescription(`Your hand: ${playerCardsString} (Total: ${playerHandValue})\nDealer's hand: ${dealerCardsString} (Total: ${dealerHandValue})`)
                ]
            });
        } catch (error) {
            console.error('An error occurred:', error);
            user.balance += amount;
            user.game_ongoing = false;
        }
    },
};
