import Discord from "discord.js";
import {CommandData, getCommands, getConfig} from "./../bot.js";

export default {
  "run": function(client, message) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Dice Master Help Menu");
    embed.setDescription("Made by DVSAEZI#0730"); //And help from Danii 💙
    embed.setThumbnail(client.user.displayAvatarURL());
    embed.setColor("RANDOM");

    const pre = getConfig().prefix;
    const noDesc = "No description provided.";
    getCommands().array().forEach(cmd =>
      embed.addField(`${pre}${cmd.help.name}`, cmd.help.description || noDesc));
    message.channel.send(embed);
  },
  "help": {
    "name": "help",
    "description": "Shows a list of all my commands, and what they do."
  }
} as CommandData;
