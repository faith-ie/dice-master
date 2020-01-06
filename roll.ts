import {CommandData} from "./../bot.js";

function rollFunction(count: number): CommandData {
  return {
    "run": function(client, message) {
      const roll = Math.floor(Math.random() * count) + 1;
      message.channel.send(`You rolled a ${roll}!`);
    },
    "help": {
      "name": `roll${count}`,
      "description": `Roll a ${count} sided die.`
    }
  };
}

export default [
  {
  "run": function(client, message) {
    message.channel.send(`You got ${Math.random() > 0.5 ? "heads": "tails"}!`);
  },
    "help": {
      "name": "flipcoin",
      "description": "Flips a coin."
    }
  },
  rollFunction(4),
  rollFunction(6),
  rollFunction(8),
  rollFunction(10),
  rollFunction(12),
  rollFunction(20)
] as CommandData[];
