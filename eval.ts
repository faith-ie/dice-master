import {inspect} from "util";
import {CommandData, getConfig} from "./../bot.js";

const escapeChar = String.fromCharCode(8203);

const cleanAndShrink = (text: string) => {
  const cleaned = text.replace(/`/g, "`" + escapeChar)
    .replace(/@/g, "@" + escapeChar);
  return cleaned.length >= 1975 ? cleaned.substr(0, 1972) + "..." : cleaned;
};

export default {
  "run": function(client, message, args) {
    //Check that the person executing this command is an owner.
    if ((getConfig().owners as string[]).includes(message.author.id)) return;
    
    try {
      //Rejoin arguments and evaluate.
      const code = args.join(" ");
      const result = eval(code);

      //Convert to string, clean, shrink and send.
      const outputData = typeof result == "string" ? result : inspect(result);
      message.channel.send(`\`\`\`xl\n${cleanAndShrink(outputData)}\`\`\``);
    } catch (err) {
      //Convert error to string, clean, shrink and send.
      const output = cleanAndShrink(inspect(err));
      message.channel.send(`\`ERROR:\` \`\`\`xl\n${output}\`\`\``);
    }
  },
  "help": {
    "name": "eval"
  }
} as CommandData;
