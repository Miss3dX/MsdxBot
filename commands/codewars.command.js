module.exports = {
    name: "codewars",
    aliases: ["cw"],
    dsOnly: true,
    execute: async(message, args, guild)=>{
        if(args.length == 0 || args[0] == "help"){
            return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.help").set("prefix", guild.prefix).stringify());
        }
        if(args[0] == "link"){
            let cwl = await Bot.models["CWLink"].findOne({
                user_id: message.author.id
            });
            if(!cwl){
                cwl = new (Bot.models["CWLink"])({
                    user_id: message.author.id,
                    code: require("crypto").Hash("md5").update(message.author.id + Date.now()).digest("hex")
                });
                await cwl.save();
            }
            if(cwl.linked_username){
                await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.ealready_linked").set("nickname", cwl.linked_username).stringify());
                return;
            }
            try {
                await message.author.send(Bot.i18n.get(guild.locale, "commands.codewars.code_dm").set("code", cwl.code).stringify());
                await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.dm_success").stringify());
            }catch(e){
                await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.dm_fail").stringify());
            }
        }
        if(args[0] == "check"){
            if(args.length != 2)return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.ewrong_check_format").set("{{prefix}}", guild.prefix).stringify());
            let cwl = await Bot.models["CWLink"].findOne({
                user_id: message.author.id
            });
            if(!cwl)return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.elink_first").stringify());
            if(cwl.linked_username){
                await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.ealready_linked").set("nickname", cwl.linked_username).stringify());
                return;
            }
            if((await Bot.models["CWLink"].findOne({linked_username: args[1]})))return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.ealready_in_use").stringify());
            let response = await (require("node-fetch"))(`https://www.codewars.com/api/v1/users/${args[1]}`, {
                headers: {
                    Authorization: process.env.CODEWARS_API_KEY
                }
            });
            let jresponse = await response.json();
            if(response.status == 404)return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.enot_found").stringify());
            if(jresponse.clan != cwl.code)return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.einvalid_link").stringify());
            cwl.linked_username = args[1];
            await cwl.save();
            return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.success_linked").set("nickname", args[1]).stringify());
        }
        if(args[0] == "claim"){
            let roles = process.env.CW_ROLES.split("|");
            let cwl = await Bot.models["CWLink"].findOne({
                user_id: message.author.id
            });
            if(!cwl)return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.elink_first").stringify());
            if(!cwl.linked_username)return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.elink_first").stringify());
            let response = await (require("node-fetch"))(`https://www.codewars.com/api/v1/users/${cwl.linked_username}`, {
                headers: {
                    Authorization: process.env.CODEWARS_API_KEY
                }
            });
            let jresponse = await response.json();
            for(let i in roles){
                await message.member.roles.remove(message.guild.roles.cache.get(roles[i]));
            }
            await message.member.roles.add(message.guild.roles.cache.get(roles[Math.abs(jresponse.ranks.overall.rank)-1]));
            return await message.channel.send(Bot.i18n.get(guild.locale, "commands.codewars.claim_success").set("kyu", Math.abs(jresponse.ranks.overall.rank)).stringify());
        }
    }
}