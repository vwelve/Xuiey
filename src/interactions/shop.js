const { default: axios } = require("axios");
const { CommandInteraction, MessageButton, MessageActionRow } = require("discord.js");
const sellixApiUrl = 'https://dev.sellix.io/v1';

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

module.exports = {
    name: "shop",
    description: "Replies with a list of products",
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    run: async (interaction, SELLIX_TOKEN) => {
        const result = await axios.get(`${sellixApiUrl}/products`, {
            headers: {
                Authorization: `Bearer ${SELLIX_TOKEN}`
            }
        }).then(res => res.data);

        if (result.status == 200 && result.data) {
            result.data.products.forEach(async (product) => {
                const button = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setURL(`https://sellix.io/product/${product.uniqid}`)
                        .setLabel("Purchase")
                        .setStyle("LINK")
                );

                await interaction.reply({ embeds: [{
                    title: product.title,
                    color: 6242533,
                    description: product.description,
                    thumbnail: {
                        url: 'https://imagedelivery.net/95QNzrEeP7RU5l5WdbyrKw/54b46e0e-e43a-4e4e-3890-12c816722d00/avatar'
                    },
                    image: {
                        url: `https://imagedelivery.net/95QNzrEeP7RU5l5WdbyrKw/${product.cloudflare_image_id}/shopItem`
                    },
                    fields: [{ name: "Price", value: formatter.format(product.price), inline: true }, { name: "Stock", value: product.stock == -1 ? 'Infinite' : product.stock, inline: true }]
                }], components: [button]});
            });
        } else {
            await interaction.reply("Sorry, but there seems to be no products available at this time.");
        }
    }
}