import mongoose from "mongoose";
const Schema = mongoose.Schema;
const BotMessage = new Schema({
    message: String

});

export default mongoose.model("BotMessage", BotMessage);