const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = require("./config");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = [{
    name: 'ping',
    description: 'Replies with Pong!'
}];

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
  
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});
  
client.login(DISCORD_TOKEN);



