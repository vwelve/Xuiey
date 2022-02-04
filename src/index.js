const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require("fs");
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN, SELLIX_TOKEN } = require("./config");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const interactions = new Map();
const commands = [];

readdirSync('./src/interactions').forEach(name => {
    let interaction = require(`./interactions/${name}`);

    interactions.set(interaction.name, interaction.run);
    commands.push({
        name: interaction.name,
        description: interaction.description
    });

    console.log(`Loaded ${interaction.name} interaction.`);
});

const registerSlashCommands = async () => {
    const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
          { body: commands },
        );
    
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }    
}

client.on('ready', async () => {
    await registerSlashCommands();
    
    console.log(`Logged in as ${client.user.tag}!`);
});
  
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    let cmd = interactions.get(interaction.commandName);
    cmd(interaction, SELLIX_TOKENx);
});
  
client.login(DISCORD_TOKEN);



