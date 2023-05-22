// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, codeBlock, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { Op } = require('sequelize');
const { Users, CurrencyShop } = require('./dbObjects.js');
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

// Create a new client instance
const client = new Client({ intents: ["Guilds", "GuildMessages", "GuildVoiceStates","MessageContent"]});

async function addBalance(id, amount) {
	const user = client.currency.get(id);

	if (user) {
		user.balance += Number(amount);
		return user.save();
	}

	const newUser = await Users.create({ user_id: id, balance: amount });
	client.currency.set(id, newUser);

	return newUser;
}

client.distube = new DisTube(client, {
	emitNewSongOnly: true,
	leaveOnFinish: true, // you can change this to your needs
	emitAddSongWhenCreatingQueue: false,
	plugins: [new SpotifyPlugin()]
});

client.commands = new Collection();
client.currency = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async() => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => client.currency.set(b.user_id, b));

	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;
	addBalance(message.author.id, 1);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

module.exports = {client, addBalance};
client.login(token);