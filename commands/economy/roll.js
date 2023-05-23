const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require("../../index");

const path = require('path');
const skinsData = require('../../scraper/weapon_skins.json');

function rollSkin() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
  
    if (randomNumber <= 40) {
      return 1; // 40% chance for 1★
    } else if (randomNumber <= 70) {
      return 2; // 30% chance for 2★
    } else if (randomNumber <= 90) {
      return 3; // 20% chance for 3★
    } else if (randomNumber <= 97) {
      return 4; // 7% chance for 4★
    } else {
      return 5; // 3% chance for 5★
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll for a weapon skin!'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder();
        const user = client.currency.get(interaction.user.id);
        const balance = user ? user.dataValues.balance : 0;

        if(balance <= 160)  return interaction.reply('You need at least 160 Valor Points to roll a skin.');

        const skinStar = rollSkin();
        const filteredSkins = skinsData.filter((skin) => skin.star === skinStar);
        const randomSkin = filteredSkins[Math.floor(Math.random() * filteredSkins.length)];
        console.log(randomSkin);

        try {
            await UserItem.create({
                userId: userId,
                name: randomSkin.collection + randomSkin.weapon,
                starLevel: skinStar,
            });

            embed.setColor('#00ff00')
            .setTitle('Roll Result')
            .setDescription(`You rolled a ${skinStar}★ skin: ${randomSkin.collection} ${randomSkin.weapon}`)
            .setImage(randomSkin.imageUrl);

            user.dataValues.balance -= 160;  

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error adding skin to user_items table:', error);
            // Handle the error and provide appropriate feedback to the user
            await interaction.reply('Sorry, an error occurred while adding the skin to your collection. Please try again later.');
        }
    },
};