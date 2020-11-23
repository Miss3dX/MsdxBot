module.exports = {
    name: "test",
    execute: async(message, args, guild)=>{
        await message.channel.send(Bot.i18n.get(guild.locale, "commands.test.success").stringify());
    }
}