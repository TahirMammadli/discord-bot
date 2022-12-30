import fetch from "node-fetch";
import mongoose from "mongoose";
import BotMessage from "./BotMessage.js"

import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

let sadWords = ["sad", "depressed", "angry", "upset"];
let encouragments = ["Cheer up!", "Hang in there!", "Everything will be fine!"];
let date = new Date();

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

});

date = `${date.getHours()} : ${date.getMinutes()}`;

client.on("messageCreate", (message) => {

  if (message.author.bot) return;
  if (message.content.startsWith("$inspire")) {
    getQuote().then((quote) => message.channel.send(quote));
  } else if (message.content.startsWith("$realinspiration")) {
    message.reply("read the documentation - Katherin Chuang");
  } else if (sadWords.some((word) => message.content.includes(word))) {
    BotMessage.find((err, list) => {
        if (err){
            console.log(err);
        }
        const encouragment = list[Math.floor(Math.random() * list.length)];
        console.log("Return from DB:", list);
        console.log("each string in the array", encouragment.message)
        message.reply(encouragment.message);
      })
    
  }else if (message.content.startsWith("$new")) {
    let encouragingMessage = message.content.split("$new ")[1]
    // updateEncouragements(encouragingMessage)
    const newMessage = new BotMessage({
        message: encouragingMessage
    })
    newMessage.save()
    .then((res) => console.log("Added a new message to the db!", res))
    .catch(err => console.log(err))
    message.channel.send("New encouraging message added.")
  }
  else if (message.content.startsWith("$del")) {
    let msg = message.content.split("$del ")[1]
    BotMessage.findOneAndDelete({message: msg.toString()}).then(result => result).catch(err => err)

    message.channel.send("Encouraging message deleted.")
  }
});

client.login(process.env.TOKEN);

await mongoose.connect(process.env.MONGO_URI);


/*
User.find({ name: 'Punit'}, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        console.log("First function call : ", docs);
    }
});
*/ 




function getMessage() {
  let messageList = [];
  
    
}
//   return messageList;

// *** ADDING TO THE DB ***
  // encouragments.map(encouragment => {
            //     console.log(encouragment)

            //     const message = new BotMessage({
            //         message: encouragment
            //     })
            //     message.save()
            //     .then((result) => console.log(result))
            //     .catch((err) => console.log(err))
            // })       

