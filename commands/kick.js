import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import { botEmbed } from "../utils.js";
export default {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Expulsa um usuário do servidor')
        .addUserOption(new SlashCommandUserOption().setRequired(true).setName("usuario").setDescription("Usuário a ser expulso")),
    /**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {
		if (interaction.member.permissions.has("KICK_MEMBERS")) {
            const user = interaction.options.getUser("usuario");
            const member = interaction.guild.members.cache.get(user.id);
            member.kick();
            await interaction.reply({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> O usuário ${user.username} foi expulso com sucesso.`, "Kick", interaction.client
                    )]
            });
            await interaction.client.guilds.cache.get("1123969284243193858").channels.cache.get("1123969923157344367").send({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> O usuário ${user.username} foi expulso com sucesso por ${interaction.user.username}.`, "Kick", interaction.client
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