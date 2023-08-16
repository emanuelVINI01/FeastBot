import { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption } from "discord.js";
import { botEmbed } from "../utils.js";
export default {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Apaga o número de mensagens do chat')
        .addIntegerOption(new SlashCommandIntegerOption().setName("quantidade").setDescription("Quantidade de mensagens a serem apagadas").setRequired(true)),
    /**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {
		if (interaction.member.permissions.has("DELETE_MESSAGES")) {
            const count = interaction.options.getInteger("quantidade");
            if (count > 100 || count < 1) {
                await interaction.reply({
                    embeds: [botEmbed(
                        interaction.user, `<:barrier:1042274061226614845> A quantidade fornecida de mensagens a serem apagadas e inválida.`, "Clear", interaction.client
                        , true)]
                });
                return
            }
            if (interaction.channel.messageCount < count) {
                count = interaction.channel.messageCount;
            }
            await interaction.channel.bulkDelete(count);
            await interaction.reply({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> Foram deletadas ${count} mensagens com sucesso!`, "Clear", interaction.client
                    , true)]
            });
            await interaction.client.guilds.cache.get("1123969284243193858").channels.cache.get("1123969923157344367").send({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> O usuário ${interaction.user.username} limpou com sucesso ${count} mensagens do canal <#${interaction.channelId}>.`, "Clear", interaction.client
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