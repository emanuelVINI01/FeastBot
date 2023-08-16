import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { QuickDB } from "quick.db";
import { botEmbed } from "../utils.js";
export default {
	data: new SlashCommandBuilder()
		.setName('revisao')
		.setDescription('Peça revisão do seu banimento')
        .addStringOption(new SlashCommandStringOption()
        
        .setName("nick")
        .setDescription("Seu nick no servidor")
        .setRequired(true)
        )
            .addStringOption(new SlashCommandStringOption().setName("motivo")
            .setDescription("Motivo do banimento")
            .setRequired(true))
            .addStringOption(new SlashCommandStringOption().setName("autor")
            .setDescription("Autor do banimento")
            .setRequired(true))
            .addStringOption(new SlashCommandStringOption().setName("explicacao")
            .setDescription("Explique por que devemos te desbanir")
            .setRequired(true)),
    /**
 * @param {import("discord.js").Interaction} interaction
 * */
	async execute(interaction) {
        const db = new QuickDB()
        let hasRevision = false

        

		const  nick = interaction.options.getString("nick");
        const  motivo = interaction.options.getString("motivo");
        const  autor = interaction.options.getString("autor");
        const  explicacao = interaction.options.getString("explicacao");
        
        const  revisions = (await db.get("revisoes")) ?? []
        const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let id = ""
        var chaactersLength = characters.length;
        
        for ( var i = 0; i < 5 ; i++ ) {
            id += characters.charAt(Math.floor(Math.random() * chaactersLength));
        }

        
        let revision 
        for (let idrev of revisions) { 
            
            revision = await db.get("revisao_"+idrev)
            
            if (revision != null)
            if (revision.nick == nick && !revision.revisada ) {
               
                hasRevision = true
                
            }
        }
        
        if (hasRevision ) {
            await interaction.reply({
                
                embeds: [botEmbed(interaction.user, `<:barrier:1042274061226614845> Você já tem uma revisão pendente.`, "Revisão", interaction.client)]
            })

            return
        }

        
        db.push("revisoes", id)
        let message = await interaction.client.guilds.cache.get("1123969284243193858").channels.cache.get("1123969438111252582").send(
            {
                embeds: [botEmbed(interaction.user, `O usuário ${interaction.user.username} pediu revisão do banimento com o ID ${id}.\n  

Nick: \`${nick}\`
Motivo: \`${motivo}\`
Autor da punição: \`${autor}\`
Explicação: \n\`${explicacao}\`

\nUse /revisar ${id} <negar/aceitar>.`, "Revisão", interaction.client)]
            }
        )
        db.set("revisao_"+id, {
            nick: nick,
            motivo: motivo,
            autor: autor,
            explicacao: explicacao,
            data: Date.now(),
            revisada: false,
            revisor: null,
            aceita: false,
            message: message.id,
            userId: interaction.user.id,
            id: id
        });
        await interaction.reply({
            "emphemeral": "true",
            embeds: [botEmbed(interaction.user, `<:diamondsword:1042273985062256671> Sua revisão foi enviada com sucesso.`, "Revisão", interaction.client)]
        })
	},
};