import {exec} from "child_process";
import {CommandData, getConfig} from "./../bot.js";

const execP = (command: string) =>
  new Promise<{out: string, err: string}>((rs, rj) =>
    exec(command, (err, stdout, stderr) => err ? rj(err) :
      rs({
        "out": stdout.toString().trim(),
        "err": stderr.toString().trim()
      })
    )
  );

export default {
  "run": async function(client, message, args) {
    //Check that the person executing this command is an owner.
    if ((getConfig().owners as string[]).includes(message.author.id)) return;

    //Run the shell command.
    const result = await execP(args.join(" "));

    //Format the output.
    const outputMsg = result.out == "" ? null :
      `Standard Output:\n\`\`\`xl\n${result.out}\`\`\``;
    const errorMsg = result.out == "" ? null :
      `Standard Error:\n\`\`\`xl\n${result.err}\`\`\``;
    const output = !outputMsg && !errorMsg ? "Completed with no output." :
      (outputMsg || "") + (errorMsg || "");

    //Check size and shrink if needed.
    if (output.length < 2000)
      message.channel.send(output)
    else
      message.channel.send(output.substr(0, 1997) + "...");
  },
  "help": {
    "name": "exec"
  }
} as CommandData;
