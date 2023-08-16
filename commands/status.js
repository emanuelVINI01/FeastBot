import { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { botEmbed } from "../utils.js";
import axios from "axios";
export default {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Mostra o status do servidor'),
        /**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {
		const server = (await axios.get("https://api.mcsrvstat.us/2/redefeast.com.br")).data;
		
		if (server.online == true) {
			await interaction.reply({
				embeds: [botEmbed(interaction.user, 
				`:zap: O servidor está online com \`${server.players.online}/${server.players.max}\` jogadores online. Use \`redefeast.com\` para jogar.`,
				"", 
				interaction.client, false)]
			});
		} else {
			await interaction.reply({
				embeds: [botEmbed(interaction.user, 
				`<:barrier:1042274061226614845> O servidor está offline no momento. Para mais informações veja o canal <#1124510327170674758>.`,
				"", 
				interaction.client, true)]
			});
		}
	},
};