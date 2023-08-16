import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';

export default async function deployCommands(token, clientId) {
    const commands = [];

    const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

    const staffCommands = []
    for (const file of commandFiles) {
        const command = (await import(`./commands/${file}`)).default;
        if (command.staff) 
            
            staffCommands.push(command.data.toJSON())
        
        else
            commands.push(command.data.toJSON());
    }


    const rest = new REST({ version: '10' }).setToken(token);


    (async () => {
        try {



            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );
            await rest.put(
                Routes.applicationGuildCommands(clientId, "1124835071183036436"),
                { body: staffCommands },
            );


        } catch (error) {

            console.error(error);
        }
    })();
}