const i18n = require("./i18n.js");

class Core {
    constructor(token, options, owners, ds_id){
        if(!options)options = {};
        this.fs = require("fs");
        this.discordjs = require("discord.js");
        this.client = new this.discordjs.Client(options);
        this.token = token;
        this.commands = new this.discordjs.Collection();
        this.models = {};
        this.owners = owners;
        this.ds_id = ds_id;
        this.setup();
    }
    setup(){
        this.fs.readdirSync("./commands/").filter(file => file.endsWith(".command.js")).forEach(commandfile => {
            let command = require(`./commands/${commandfile}`);
            this.commands.set(command.name, command);
            console.log(`[Core/Setup] Loaded command "${command.name}".`);
        });
        this.fs.readdirSync("./events/").filter(file => file.endsWith(".event.js")).forEach(eventfile => {
            let event = require(`./events/${eventfile}`);
            this.client.on(event.trigger, event.handler);
            console.log(`[Core/Setup] Added listener for event "${event.trigger}".`);
        });
        let data = {};
        this.fs.readdirSync("./locales/").filter(file => file.endsWith(".locale.json")).forEach(localefile => {
            data[localefile.split(".")[0]] = require(`./locales/${localefile}`);
        });
        this.i18n = new i18n(data);
        this.mongoose = require("mongoose");
        this.fs.readdirSync("./models/").filter(file => file.endsWith(".model.js")).forEach(modelfile => {
            let model =  require(`./models/${modelfile}`)(this.mongoose);
            let instance = new model({});
            this.models[instance.constructor.modelName] = model;
            console.log(`[Core/Setup] Loaded model "${instance.constructor.modelName}."`);
        })
        this.mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        this.mongoose.connection.on("connected", ()=>{
            console.log("[Msdx/Log] Connected to DataBase.");
        });
    }
    launch(options){
        this.client.login(this.token);
    }
}

module.exports = Core;