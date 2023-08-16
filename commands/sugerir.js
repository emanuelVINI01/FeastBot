import { EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { botEmbed } from "../utils.js";
export default {
	data: new SlashCommandBuilder()
		.setName('sugerir')
		.setDescription('Envie uma sugestão para o servidor')
        .addStringOption(new SlashCommandStringOption().setName("sugestao").setRequired(true).setDescription("Sua sugestão a ser enviada.")) ,
	/**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {

        const embed = new EmbedBuilder()
        embed.setTitle("<:netherstar:1042611980722253934> **SUGESTÃO ENVIADA!**")
        embed.setDescription(`O jogador <@${interaction.user.id}> enviou uma sugestão

> \`${interaction.options.getString("sugestao")}\`
        `)
        embed.setColor("Blue")
        embed.setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({
                dynamic: true
            })
        })
        const message = await interaction.guild.channels.cache.get("1124511706685640844").send({
            embeds: [embed]
        })
        await message.react("✅")
        await message.react("❌")
        await interaction.reply({
            embeds: [botEmbed(interaction.user, `Sua sugestão foi enviada com sucesso.`, "", interaction.client, false)]
        })
		
	},
};