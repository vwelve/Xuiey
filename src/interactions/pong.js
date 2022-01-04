const { Interaction } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Replies with Pong!",
    /**
     * 
     * @param {Interaction} interaction 
     */
    run: async (interaction) => {
        await interaction.reply('Pong!');
    }
}