import { AttachmentBuilder, Embed, EmbedBuilder } from "discord.js"


function botEmbed(author, description, title, client, error) {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: author.username,
            iconURL: author.displayAvatarURL({
                "dynamic": true
            })
        })
        .setFooter({
            text: "Rede Feast",
            iconURL: client.user.displayAvatarURL()
        })
        .setDescription(description)

        .setColor(!error ? "Blue" : "Red")
    
    return embed
}




export {
    botEmbed
}