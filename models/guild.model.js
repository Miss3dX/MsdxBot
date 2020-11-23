module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        guild_id: String,
        prefix: {type: String, default: "mb!"},
        locale: {type: String, default: "ru"},
        blacklisted: {type: Boolean, default: false}
    });
    return mongoose.model("Guild", schema);
}