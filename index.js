// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, codeBlock, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = process.env.token
const { Op } = require('sequelize');
const { Users, CurrencyShop } = require('./dbObjects.js');
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

// Create a new client instance
const client = new Client({ intents: ["Guilds", "GuildMessages", "GuildVoiceStates","MessageContent"]});

async function addBalance(id, amount) {
	const user = await Users.findOne({ where: { user_id: id } });

	if (user) {
		user.balance += Number(amount);
		return user.save();
	}
	else {
		const newUser = await Users.create({ user_id: id, balance: amount });
		client.currency.set(id, newUser);

		return newUser;
	}
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

const vpCooldown = 8 * 60 * 60 * 1000; // Cooldown duration in milliseconds (8 hours)
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const userId = message.author.id;

    let [user, created] = await Users.findOrCreate({
		where: { user_id: userId },
	});
    if (created) {
		// A new user was created
		console.log('New user created:', user.user_id);
	} else {
		// User already exists
	}

    const userLastReceived = user.last_received.getTime(); // Convert the last_received value to milliseconds

    const currentTime = Date.now();

    // Calculate the time elapsed since the last VP received
    const timeElapsed = currentTime - userLastReceived;

    // Check if 8 hours have passed since the last VP received (28800000 milliseconds)
    if (timeElapsed >= vpCooldown) {
        // If 8 hours have passed, reset the last received time to the current time
        user.last_received = new Date(currentTime);
		user.vp_remaining = 320;
        await user.save();
    }

    const vpToAdd = Math.min(user.vp_remaining, 5); // Calculate the VP to add, limited to 5 VP per message and up to a maximum of 320 every 8 hours

    if (vpToAdd <= 0) {
        return;
    }

    // Call the addBalance function to add VP to the user's balance
    addBalance(userId, vpToAdd);
	user.vp_remaining -= vpToAdd;
	await user.save();
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