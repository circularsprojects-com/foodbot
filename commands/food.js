const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const http = require("http")
const { InfluxDB, WriteApi, Point } = require('@influxdata/influxdb-client');
const { hostname } = require("os");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('food')
		.setDescription('gives food image'),
	async execute(interaction) {
		try {
		response = ""
			//http.get('http://foodish-api.herokuapp.com/api', async function(res) {
            try {
                http.get('http://server.circularsprojects.com:3000/api', async function(res) {
                    res.on('data', async function(chunk) {
                        response += chunk;
                    });
                    res.on('end', async function() {
                        try {
                            const foodEmbed = new EmbedBuilder()
                                // the API endpoint does not return a category, but it can be derived from the url. (https://api:3000/images/CATEGORY/image)
                                // set the embed title to that category derived from JSON.parse(response).image
                                .setTitle("food image")
                                .setColor(0x0099FF)
                                .setDescription(`category: ${JSON.parse(response).image.split("/")[4]}`)
                                .setImage(JSON.parse(response).image)
                                .setFooter({text:"also try /category"})
                            //console.log(foodEmbed);
                            //interaction.editReply(JSON.parse(response).image);
                            await interaction.editReply({ embeds: [foodEmbed.data] });
                        } catch(e) {
                            interaction.editReply("**Something's not adding up.**\nAn error has occurred in fetching a food image. This is most likely due to the API being down, or I'm doing maintenance on the bot.\nIf you want, you can contact me in the food-bot support discord server, and I'll try to fix it.\n\n`Error trace: " + e + "`")
                        }
                    });
                    res.on('error', async function() {
                    	try {
                    		await interaction.editReply("**Something's not adding up.**\nAn error has occurred in fetching a food image. This is most likely due to the API being down, or I'm doing maintenance on the bot.\nIf you want, you can contact me in the food-bot support discord server, and I'll try to fix it.")
                    	} catch {}
                    })
                });
            } catch {
                interaction.editReply("**Something's *really* not adding up.**\nA fatal error has occurred in fetching a food image. Most likely, this is just a temporary hiccup. Try again later.\nIf the bot still doesn't work, you can contact me in the food-bot support discord server, and I'll try to fix it.")
            }
		} catch(err) {
			interaction.editReply("blast! it didnt work!\n" + err)
		}
	}
};
