module.exports = {
    name: "evaluate",
    aliases: ["eval"],
    ownerOnly: true,
    execute: async(message, args, guild) => {
        let code = args.join(" ");
        if(!code){
            return await message.channel.send(Bot.i18n.get(guild.locale, "commands.evaluate.nocode").stringify());
        }
        try {
            let result = eval(code);
            if(Promise.resolve(result) == result){
                result = await result;
            }
            let iresult = require("util").inspect(result, {depth: 2});
            await message.channel.send({
                embed: {
                    color: 0x00FF00,
                    description: "```js\n"+(iresult.length <= 1950 ? iresult : iresult.slice(0, 1920) + `\n${iresult.length - 1920} more symbols...`)+"\n```"
                }
            });
        }catch(e){
            await message.channel.send({
                embed: {
                    color: 0x00FF00,
                    description: "```js\n"+(e.toString().length <= 1950 ? e.toString() : e.toString().slice(0, 1920) + `\n${e.toString().length - 1920} more symbols...`)+"\n```"
                }
            });
        }
    }
}