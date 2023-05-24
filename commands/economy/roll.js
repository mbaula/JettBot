const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require("../../index");
const { Users } = require('../../dbObjects.js');
const crypto = require('crypto');

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

function generateItemId(skinName) {
    const hash = crypto.createHash('md5');
    const itemId = hash.update(skinName).digest('hex');
    return itemId;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll for a weapon skin!'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder();
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        const balance = user ? user.balance : 0;

        if (balance <= 160) {
            return interaction.reply('You need at least 160 Valor Points to roll a skin.');
        }

        const skinStar = rollSkin();
        const filteredSkins = skinsData.filter((skin) => skin.star === skinStar);
        const randomSkin = filteredSkins[Math.floor(Math.random() * filteredSkins.length)];

        let itemId = generateItemId(`${randomSkin.collection} + ${randomSkin.weapon}`);
        
        try {
            console.log(interaction.user.id, itemId);
            console.log(skinStar);
            const existingUser = await Users.findOne({ where: { user_id: interaction.user.id } });

            if (existingUser) {
                const item = {
                    id: itemId,
                    skinName: randomSkin.collection + ' ' + randomSkin.weapon,
                    starLevel: skinStar,
                };

                console.log('ITEM', item)

                await existingUser.addItem(item);
            } else {
                console.error('User not found:', interaction.user.id);
                return interaction.reply('Sorry, an error occurred while adding the skin to your collection. Please try again later.');
            }

            embed.setColor('#00ff00')
                .setTitle('Roll Result')
                .setDescription(`You rolled ...`);

            const loadingGIF = 'https://media.tenor.com/lTn_Gj0ljzYAAAAd/jett-valorant.gif'; 

            embed.setImage(loadingGIF);
            const reply = await interaction.reply({ embeds: [embed] });

            await new Promise(resolve => setTimeout(resolve, 2000));

            user.balance -= 160;
            await user.save();

            embed.setTitle('Roll Result')
            .setDescription(`You rolled a ${skinStar}★ skin: ${randomSkin.collection} ${randomSkin.weapon}`)
            .setImage(randomSkin.imageUrl);

            // Set embed color based on skinStar value
            if (skinStar === 1) {
                embed.setColor('#4f504f'); 
            } else if (skinStar === 2) {
                embed.setColor('#eaefed');
            } else if (skinStar === 3) {
                embed.setColor('#52d3de'); 
            } else if (skinStar === 4) {
                embed.setColor('#bd364f'); 
            } else if (skinStar === 5) {
                embed.setColor('#fef3a1'); 
            }

            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error adding skin to user_items table:', error);
            await interaction.reply('Sorry, an error occurred while adding the skin to your collection. Please try again later.');
        }
    },
};
