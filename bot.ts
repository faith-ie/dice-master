import Discord, {Client, Collection} from "discord.js";
import {Of} from "daniis-tools"; import "daniis-tools";
import req from "require-yml";
import FS from "fs";

//Command data interface.
export interface CommandData {
  run(client: Client, message: Discord.Message, args: string[]);

  help: {
    name: string,
    description?: string
  };
}

let client: Client;
let config: Of<any>;
let commands: Collection<string, CommandData>;

const shutdownHooks: (() => void)[] = [];

//Promise based FS.readdir.
const readDirP = (path: string) => new Promise<string[]>((rs, rj) =>
  FS.readdir(path, (err, files) => err ? rj(err) : rs(files)))

export const getConfig = () => Object.clone(config);
export const getCommands = () => commands;
export const fireShutdown = () => shutdownHooks.forEach(hook => hook());
export const addShutdownHook: (hook: () => void) => void =
  Array.prototype.push.bind(shutdownHooks);

async function main() {
  //Load config and command file names.
  config = req("./config.yml");
  const commandFiles = await readDirP("./commands/");
  if (commandFiles.length === 0) throw new Error("No commands found.");

  //Load all commands.
  client = new Client();
  commands = new Collection();
  //Assert that all files in ./commands/ return type of CommandData
  const commandData: CommandData[] = (await Promise.all(commandFiles
    .map(async command => import("./commands/" + command))))
      .map(command => command.default).flat();
  commandData.forEach(async command => {
    commands.set(command.help.name, command);
    console.log(`Loaded command ${command.help.name}.`);
  });

  client.on("message", onMessage);
  client.on("ready", () => client.user.setActivity(`Rolling dice on ${client.guilds.size} servers!`));
  client.login(config.token);
  addShutdownHook(client.destroy.bind(client.destroy));
}

function onMessage(message: Discord.Message) {
  //If in a DM or author is a bot, ignore.
  if (message.channel.type == "dm" || message.author.bot) return;

  //Check that command starts with prefix.
  const prefix = config.prefix;
  if (!message.content.startsWith(prefix)) return;

  //Parse arguments.
  const parsedArgs = message.content.substr(prefix.length).split(/ +/g);
  const command = parsedArgs[0];
  const args = parsedArgs.slice(1);

  //Gets the command data, ignore if there is none.
  const commandData = commands.get(command.toLowerCase());
  if (!commandData) return;

  try {
    //Run the command.
    commandData.run(message.client, message, args);
  } catch (err) {
    //Catch any uncaught errors that might occur.
    message.reply("an error occoured while running your command.");
    console.error(err);
  }
}

//Catch all with console.error.
main().catch(console.error);
