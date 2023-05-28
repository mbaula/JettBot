# JettBot
JettBot is a feature-rich Discord bot built with Discord.js, Sequelize, and Distube. It provides a full-fledged economy system with a database, as well as fun gambling commands like roulette, blackjack, and slots. It also offers Valorant-specific commands such as picking random agents and a gacha system for rolling Valorant skins. It also offers music playing functionality.

**Blackjack**

![image](https://github.com/mbaula/JettBot/assets/57877999/35fde3eb-4587-45ef-83a6-b3aec64ef5d7)

**Valorant Skin Collection**

![image](https://github.com/mbaula/JettBot/assets/57877999/54ae869e-a37c-4a55-96f5-29b07e9b63fe)
![image](https://github.com/mbaula/JettBot/assets/57877999/6a1f2822-af9f-4e69-9103-bda06e26af73) 

**Slots**

![image](https://github.com/mbaula/JettBot/assets/57877999/cf234227-d061-49aa-aaae-ecc754cefeb8)

## Installation

1. Clone the repository. In your terminal:
```git clone https://github.com/mbaula/JettBot.git```

2. Install dependencies: ```npm install```

3. Set up the configuration: 
  > * Rename config.example.json to config.json.
  > * Fill in the required values in config.json, such as the Discord bot token and other configuration options.

4. Set up the database:
JettBot uses a Sequelize database for the economy system. Run the necessary Sequelize migration and seed files to set up the database schema and initial data.
```node dbInit.js```

5. Start the bot 
```
node .\deploy-commands.js
node index.js
```

6. The bot should now be online and ready to use. You can invite it to your Discord server and interact with it using the available commands.

## Usage

To use the bot, you need to invite it to your Discord server:

1. Go to the Discord Developer Portal: 
2. Create a new application and give it a name.
3. Under the "Bot" tab, click on "Add Bot" to create a bot for your application.
4. Copy the bot token.
5. Generate an invite URL 
   - Replace `YOUR_CLIENT_ID` with your application's client ID
   - Replace `YOUR_PERMISSIONS` with the required bot permissions (e.g. Read Messages and Send Messages).
6. Open the invite URL in your browser and select the server where you want to add the bot.
7. Complete the authorization process, and the bot will be added to your server.

Once the bot is in your server, you can use the available commands.
Use ```/help``` for more info

## Motivation

JettBot was created with the following motivations in mind:

- **Community Engagement:** I wanted a fun way for the users in the Discord servers I was in to be able to interact with one another. Since a lot of us played valorant, I thought creating a valorant-related bot would be a great way to promote engagement and interaction as well as friendly competition among our server members. Some of the features such as the ability to gamble virtual currency that the user can earn adds excitement and promotes daily activity within the server. Collecting valorant skins also provide users with a sense of progression and achievement the more they participate within the server. The bot also provides many entertainment features such as generating jokes, sharing reddit memes, GIF interactions and rating users 'rizz.' These are features that are whimsical and aim to make users laugh. Lastly, I noticed that many of the bots that are supposed to support playing music, did not work anymore. Since I had trouble finding one that worked, I decided to make it myself.

- **Learning JavaScript:** The project provided me an opportunity to further explore and deepen my understanding of JavaScript. Building a Discord bot with Discord.js forced me to enhance my proficiency in the JS language and learn more about its various features, libraries, and frameworks.

- **Diving into Databases:** I wanted a way to incorporate databases and implement how they interact with JavaScript applications. JettBot's economy system and gambling features required persistent data storage in order to keep track of users informations, like the skins they own or how much virtual currency the have. This led me to utilize databases like Sequelize (an ORM - Object Relational Mapping) which allowed me to dive into the world of data modeling, querying, and the integration of JavaScript and databases.

- **Applying Practical Knowledge:** I wanted bring together different concepts I've learned, such as event handling, API integration, command parsing, and data management in a singular project. A good way to do this was to develop a cohesive and functional Discord bot with many features. This project allowed me to see the practical results of my learning and strengthen my problem-solving abilities.
