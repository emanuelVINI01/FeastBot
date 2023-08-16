import { Collector, EmbedBuilder, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption, VoiceChannel } from "discord.js";
import { botEmbed } from "../utils.js";
import axios from "axios";
export default {
    data: new SlashCommandBuilder()
        .setName('anunciar')
        .setDescription('Anúncia uma mensagem no canal de anúncios')
        .addStringOption(new SlashCommandStringOption().setName("titulo").setRequired(true).setDescription("Título do anúncio (embed)."))
        .addChannelOption(new SlashCommandChannelOption().setName("canal").setRequired(true).setDescription("Canal que o anúncio será enviado."))
       
        .addBooleanOption(new SlashCommandBooleanOption().setName("embed").setRequired(true).setDescription("A mensagem será enviada como embed."))
        .addBooleanOption(new SlashCommandBooleanOption().setName("todos").setRequired(true).setDescription("Mencione todos jogadores")),
    /**
* @param {import("discord.js").Interaction} interaction
* */
    async execute(interaction) {
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
           
            const titulo = interaction.options.getString("titulo");
            const todos = interaction.options.getBoolean("todos");
            const isEmbed = interaction.options.getBoolean("embed");
            const channel = interaction.options.getChannel("canal")
            const filter = (m) => m.author.id === interaction.user.id
            
            await interaction.reply({
                "content": "Envie a mensagem a ser anunciada."
            })

            const mensagem = (await interaction.channel.awaitMessages({
                filter, max: 1
            })).values().next().value.content
            

            
            if (isEmbed) {
                const embed = new EmbedBuilder()
                embed.setTitle(titulo)
                embed.setDescription(mensagem)
                embed.setColor("Blue")
                channel.send({
                    embeds: [embed]
                })
            } else {
                channel.send(mensagem)
            }
            if (todos) {
                await (await channel.send("@everyone")).delete()
            }
            await interaction.client.guilds.cache.get("1123969284243193858").channels.cache.get("1123969923157344367").send({
                embeds: [botEmbed(
                    interaction.user, `<:barrier:1042274061226614845> O usuário ${interaction.user.username} enviou um anúncio no canal <#${channel.id}>.`, "Anúncio", interaction.client
                    )]
            });
            await interaction.editReply({
                content: "",
                
                embeds: [botEmbed(interaction.user, `O Anúncio foi enviado com sucesso.`, "", interaction.client, false)]
            })
        } else {
            await interaction.reply({
                embeds: [botEmbed(
                    user, `<:barrier:1042274061226614845> Você não tem permissão para executar esse comando.`, "Sem permissão", interaction.client
                    , true)],
                ephemeral: true
            });
        }
    },
};