import { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { botEmbed } from "../utils.js";
export default {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Silencia um usuário do servidor')
        .addUserOption(new SlashCommandUserOption().setRequired(true).setName("usuario").setDescription("Usuário a ser expulso"))
        .addIntegerOption(new SlashCommandIntegerOption().setRequired(true).setName("tempo").setDescription("Tempo em minutos do silenciamento."))
        .addStringOption(new SlashCommandStringOption().setRequired(true).setName("motivo").setDescription("Motivo do silenciamento.")),
        /**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {
		if (interaction.member.permissions.has("SILENCE_MEMBERS")) {
            const user = interaction.options.getUser("usuario");
            const time = interaction.options.getInteger("tempo");
            const reason = interaction.options.getString("motivo");
            const member = interaction.guild.members.cache.get(user.id);
            member.timeout(time * 1000 * 60)
            await interaction.reply({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> O usuário ${user.username} foi mutado com sucesso.`, "Silênciamento", interaction.client
                    )]
            });
            await interaction.client.guilds.cache.get("1123969284243193858").channels.cache.get("1123969923157344367").send({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> O usuário ${user.username} foi silenciado por ${time} minutos pelo motivo ´${reason}´ com sucesso por ${interaction.user.username}.`, "Silênciamento", interaction.client
                    )]
            });
        } else {
            await interaction.reply({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> Você não tem permissão para executar esse comando.`, "Sem permissão", interaction.client
                    , true)],
                    ephemeral: true
            });
        }
	},
};