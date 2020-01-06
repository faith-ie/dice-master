import Discord from "discord.js";
import {CommandData} from "./../bot.js";

export default {
  "run": function(client, message) {
    const embed = new Discord.MessageEmbed();
    embed.setColor("RANDOM");
    embed.setTitle("Add Me");
    embed.setDescription(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`);
    message.author.send(embed);
    message.channel.send("Check your Direct Messages!");
  },
  "help": {
    "name": "invite",
    "description": "Sends a DM with an invite link for me."
  }
} as CommandData;
