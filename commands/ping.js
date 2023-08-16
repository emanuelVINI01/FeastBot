import { SlashCommandBuilder } from "discord.js";
import { botEmbed } from "../utils.js";
export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mostra o ping do bot'),
	/**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {
		await interaction.reply({
            embeds: [botEmbed(
                interaction.user, `<:Ping:1042509939547045908> O ping atual do bot está em ${interaction.client.ws.ping}ms.`, "Ping", interaction.client
                )]
        });
	},
};