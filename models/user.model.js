module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        guild_id: String,
        user_id: String,
        blacklisted: {type: Boolean, default: false},
        premium: {type: Boolean, default: false}
    });
    return mongoose.model("User", schema);
}