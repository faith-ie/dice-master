import {CommandData, fireShutdown, getConfig} from "./../bot.js";

export default {
  "run": function(client, message) {
    //Check that the person executing this command is an owner.
    if ((getConfig().owners as string[]).includes(message.author.id)) return;

    message.channel.send("Shutting down...");
    fireShutdown();
  },
  "help": {
    "name": "kill",
    "description": "Slays the bot."
  }
} as CommandData;
