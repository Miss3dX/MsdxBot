module.exports = {
    name: "information",
    aliases: ["info"],
    execute: async(message, args, guild) => {
        return await message.channel.send({
            embed: {
                title: Bot.i18n.get(guild.locale, "commands.information.embed_title").stringify(),
                color: 0xDEADFF,
                description: Bot.i18n.get(guild.locale, "commands.information.embed_description")   .set("developer", process.env.BOT_OWNERS.split("|").map(devid => Bot.client.users.cache.get(devid).tag))
                                                                                                    .set("njsv", process.version)
                                                                                                    .set("djsv", Bot.discordjs.version)
                                                                                                    .set("guilds", Bot.client.guilds.cache.size)
                                                                                                    .set("users", Bot.client.guilds.cache.map(g => g.memberCount).reduce((a, b)=>a+b))
                                                                                                    .stringify()
            }
        });
    }
}