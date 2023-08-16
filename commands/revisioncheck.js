import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption, embedLength } from "discord.js";
import { QuickDB } from "quick.db";
import { botEmbed } from "../utils.js";
export default {
    staff: true,
	data: new SlashCommandBuilder()
		.setName('revisar')
		.setDescription('Revise uma revisão de banimento.')
        .addStringOption(new SlashCommandStringOption().setName("id").setDescription("ID da revisão.").setRequired(true))
        .addBooleanOption(new SlashCommandBooleanOption().setName("status").setDescription("Aceitar ou recusar a revisão.").setRequired(true)),
     /**
 * @param {import("discord.js").Interaction} interaction
 * */    
	async execute(interaction) {
		if (interaction.member.roles.cache.has("1124337600799453184") || interaction.member.roles.has("1124460382145232927")) {
            const db = new QuickDB()
            const user = interaction.user
        
            const id = interaction.options.getString("id");
            const accept = interaction.options.getBoolean("status");
            const revisao = await db.get("revisao_"+id)
            if (revisao == null) {
                await interaction.reply({
                    embeds: [botEmbed(
                        user, `<:barrier:1042274061226614845> A revisão não foi encontrada.`, "Revisão não encontrada", interaction.client
                        , true)]
                });
                return
            }
            if (revisao.revisada) {
                await interaction.reply({
                    embeds: [botEmbed(
                        user, `<:barrier:1042274061226614845> A revisão já foi revisada por ${revisao.revisor}.`, "Revisão não encontrada", interaction.client
                        , true)]
                });
                return
            }
            
            revisao.revisada = true
            revisao.aceita = accept
            revisao.revisor = user.username
            /*
            * @type {import("discord.js").GuildChannel  }
            */
            const channel = interaction.guild.channels.cache.get("1123969438111252582")

            const message = await channel.messages.fetch(revisao.message)

            
            message.edit({
                embeds: [botEmbed(user, `O usuário ${revisao.revisor} pediu revisão do banimento com o ID ${id}.\n  

                Nick: \`${revisao.nick}\`
                Motivo: \`${revisao.motivo}\`
                Autor da punição: \`${revisao.autor}\`
                Explicação: \n\`${revisao.explicacao}\`
                
                \nRevisão ${accept ? "aceita" : "negada"} por ${revisao.revisor}.`, "Revisão", interaction.client)]
            })

            try {
                const msgToUser = {
                    embeds: [botEmbed(user, 
`Sua revisão foi **${accept ? "ACEITA" : "NEGADA"}** por \`${revisao.revisor}\`.
Motivo: Punição aplicada **${accept ? "incorretamente" : "corretamente"}**.`
                        , "Revisão", interaction.client)]
                }
                const userd = await interaction.client.users.fetch(revisao.userId)
                userd.send(msgToUser)
            } catch(ex) {
                console.log(ex)
            }

            interaction.client.guilds.cache.get("1123969284243193858").channels.cache.get("1123969438111252582").send({
                embeds: [botEmbed(user, 
                    `A revisão de \`${revisao.nick}\` foi **${accept ? "ACEITA" : "NEGADA"}** por \`${revisao.revisor}\`.
Motivo: Punição aplicada **${accept ? "incorretamente" : "corretamente"}**.`
                    , "Revisão", interaction.client)]
            })
            db.set("revisao_"+id, revisao)
            await interaction.reply({
                embeds: [botEmbed(
                    user, `<:commandblock:1042273859333799947> A revisão foi **${accept ? "ACEITA" : "NEGADA"}** com sucesso.`, "Revisão atualizada", interaction.client
                    )]
            });
            
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