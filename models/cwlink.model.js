module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        user_id: String,
        code: String,
        linked_username: String
    });
    return mongoose.model("CWLink", schema);
}