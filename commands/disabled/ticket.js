import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SelectMenuBuilder, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { botEmbed } from "../utils.js";
export default {

	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Envia a mensagem de ticket.'),
        /**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                "customId": "ticket-compras",
                "style": ButtonStyle.Secondary,
                "emoji": "💸",
            }),
            new ButtonBuilder({
                "customId": "ticket-bugs",
                "style": ButtonStyle.Secondary,
                "emoji": "⚙️",
            }),
            new ButtonBuilder({
                "customId": "ticket-duvidas",
                "style": ButtonStyle.Secondary,
                "emoji": "👤",
            }),
            new ButtonBuilder({
                "customId": "ticket-denuncia",
                "style": ButtonStyle.Secondary,
                "emoji": interaction.client.emojis.cache.get("1042274061226614845"),
            }),
            new ButtonBuilder({
                "customId": "ticket-confirmar-clan",
                "style": ButtonStyle.Secondary,
                "emoji": interaction.client.emojis.cache.get("1124018789705601166"),
            }),
        )
		interaction.channel.send({
            embeds: [new EmbedBuilder().
            setTitle("<:882150470330753054:1042518921418379336> CENTRAL DE SUPORTE").
            setDescription(`

            Clique no botão correspondente à categoria de suporte que você deseja abrir:
            
        
            💸 ➟ Financeiro;
            ⚙️ ➟ Reportar bugs;
            👤 ➟ Dúvidas;
            <:barrier:1042274061226614845> ➟ Denúncia;
            <:feastroxo:1124018789705601166> ➟ Confirmar clan.`).
            setColor("Blue")],
            components: [row]
        })
	},
};