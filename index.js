import { ActionRowBuilder, ActivityType, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, PermissionFlagsBits } from 'discord.js';
import path from 'path'
import fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import deployCommands from './deploy_commands.js';
import { QuickDB } from 'quick.db';

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const config = loadJSON('./config.json');

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.Guilds]
})




client.reloadCommands = async () => {
    client.commands = new Collection();

    const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = "./commands/" + file;

        const command = (await import(filePath)).default;

        if ('data' in command && 'execute' in command) {

            client.commands.set(command.data.name, command);
        }
    }
}
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        if (interaction.member.roles.cache.has("1124337600799453184") || interaction.member.permissions.has(8) || interaction.channel.id === "1124512169921359974") {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`Nenhum referência SK2 encontrada referente a esse comando.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                try { await interaction.reply({ content: 'Ocorreu um erro ao executar esse comando.', ephemeral: true }) } catch (ex) {}
            }
        }
    }
    if (interaction.isButton()) {

        if (interaction.customId.includes("ticket-")) {

            const db = new QuickDB()
            const tickets = await db.get("tickets") ?? []

            const ticket = tickets.filter(t => t.memberId === interaction.user.id)[0]

            if (ticket) {
                interaction.reply({
                    content: "Você já possui um ticket aberto.",
                    ephemeral: true
                })
                return
            }
			interaction.message.edit({
				embeds: interaction.message.embeds
			})
            const type = interaction.customId.replace("ticket-", "")
            let allowedId = "1042604335474937876"
            if (type == "compras") {
                allowedId = "1046948534852784269"
            }
            const channel = await interaction.guild.channels.create({
                type: ChannelType.GuildText,
                name: `${type}-${interaction.user.username}`,
                parent: "1124512919820963891",
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks
                        ]
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: allowedId,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks
                        ]
                    }
                ]
            })
            const row = new ActionRowBuilder(


            ).addComponents(
                new ButtonBuilder()
                    .setCustomId("close")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Danger)

                    .setLabel("Fechar")
            )

            const embed = new EmbedBuilder().setColor("Blue").setDescription(`Olá, <@${interaction.user.id}>

            > ◆ Tire suas dúvidas com nossa equipe! Responderemos o mais rápido possível!
            > ◆ Horário de atendimento: Segunda a Sexta: 12h as 18h30`).setTitle("<:882150470330753054:1042518921418379336> ATENDIMENTO")

            db.push("tickets", {
                memberId: interaction.user.id,
                channelId: channel.id

            })
            channel.send({
                embeds: [embed],
                components: [row]
            })
            interaction.reply({
                "ephemeral": true,
                "content": `Seu ticket foi criado com sucesso! <#${channel.id}>`
            })
            return
        }
    }
    if (interaction.isButton()) {


        if (interaction.customId === "close") {
            const db = new QuickDB()
            const tickets = await db.get("tickets") ?? []
            const ticket = tickets.filter(t => t.channelId === interaction.channel.id)[0]
            const message = await interaction.message.fetch()
            message.components[0].components[0] = new ButtonBuilder()
                .setCustomId("close")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
                .setLabel("Fechar")


            await message.edit({
                row: message.components
            })
            if (ticket) {
                try {
                    await interaction.channel.send("O ticket será removido em 5 segundos...")
                    await interaction.deferUpdate()
                    setTimeout(async () => {
                        try {
                            let transcript = `Transcript do ticket de ${interaction.guild.members.cache.get(ticket.memberId).user.username} fechado as ${new Date().toLocaleString("pt-BR")}.\n\n`
                            const messages = await interaction.channel.messages.fetch()
                            messages.reverse()
                            messages.forEach((message) => {

                                if (message.author.id !== client.user.id)
                                    transcript += `${new Date(message.createdTimestamp).toLocaleString("pt-BR")} ${message.author.username} : ${message.content}\n`
                            })

                            interaction.guild.channels.cache.get("1125113063973068871").send({
                                "files": [new AttachmentBuilder(new Buffer.from(transcript, "utf-8"), { name: 'transcript.txt' })]
                            })
                            await interaction.channel.delete()
                            await db.set("tickets", tickets.filter((ticketd) => ticketd != ticket))
                        } catch (ex) {

                        }
                    }, 5000)
                } catch (ex) {
                    console.log(ex)
                }
            }
        }
    }
});

client.on(Events.GuildMemberAdd, async member => {
    if (member.guild.id === "1123969284243193858")
        member.roles.add(config.autorole)
})

client.on("ready", async () => {
    await client.reloadCommands()
    await deployCommands(client.token, client.user.id);
    console.log("REDE FEAST: Bot iniciado com sucesso.")
    client.user.setPresence({ activities: [{ name: `redefeast.com.br`, type: ActivityType.Playing }], status: 'Jogando no melhor servidor de Minecraft.' })

})

client.login("MTEyNDE2MTc1MTgwMjQ1NDA0Nw.GFzQJS.6Ce_wlaKnYavzBa5YKiha9UyunX7vUTU9IRR_w")

