module.exports = {
    trigger: "message",
    handler: async(message)=>{
        if(message.author.bot || message.channel.type == "dm" || !message.content)return;
        let guild = await Bot.models["Guild"].findOne({
            guild_id: message.guild.id
        });
        if(!guild){
            guild = new (Bot.models["Guild"])({
                guild_id: message.guild.id
            });
            await guild.save();
        }
        let user = await Bot.models["User"].findOne({
            guild_id: message.guild.id,
            user_id: message.author.id
        });
        if(!user){
            user = new (Bot.models["User"])({
                guild_id: message.guild.id,
                user_id: message.author.id
            });
            await user.save();
        }
        if(!message.content.startsWith(guild.prefix))return;
        let args = message.content.slice(guild.prefix.length).split(/ +/g);
        let commandName = args.shift();
        let command = Bot.commands.get(commandName) || Bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command)return;
        if(command.ownerOnly && !Bot.owners.includes(message.author.id))return;
        if(command.dsOnly && message.guild.id != Bot.ds_id)return;
        for(let i in (command.required_botperms?["EMBED_LINKS"].concat(command.required_botperms):["EMBED_LINKS"])){
            let permission = (command.required_botperms?["EMBED_LINKS"].concat(command.required_botperms):["EMBED_LINKS"])[i];
            if(!message.channel.permissionsFor(message.guild.me).has(permission)){
                await message.channel.send(Bot.i18n.get(guild.locale, "global_errors.nobotperms").set("permission", permission).stringify());
                return;
            }
        }
        for(let i in (command.required_userperms?command.required_userperms:[])){
            let permission = (command.required_userperms?command.required_userperms:[])[i];
            if(!message.channel.permissionsFor(message.member).has(permission)){
                await message.channel.send(Bot.i18n.get(guild.locale, "global_errors.nouserperms").set("permission", permission).stringify());
                return;
            }
        }
        command.execute(message, args, guild, user);
    }
}