import { Client, Collection, Routes } from "discord.js";
import commandList from "./command";
import { MyClient } from "./type";
import { discordREST } from "./util";

const { CLIENT_ID, BOT_TOKEN } = process.env;

export async function handleSaveSlashCommandList(client: MyClient) {
  client.commands = new Collection();
  commandList.forEach((command) => {
    client.commands.set(command.data.name, command.execute);
  });
}

export async function registerSlashCommandList(client: MyClient) {
  if (!client?.application) return;
  const commandNameList = (() => {
    const currentList = [];
    const iterator = client.commands.values();
    while (true) {
      const current = iterator.next();
      if (current.done) break;
      currentList.push(current.value);
    }
    return currentList;
  })();
  const commandDataList = commandList.map(({ data }) => data.toJSON());
  console.log(
    `Started refreshing ${commandNameList.length} application (/) commands`
  );
  try {
    const guildIDList = client.guilds.cache.map((guild) => guild.id);
    for (const guildID of guildIDList) {
      await discordREST.put(
        Routes.applicationGuildCommands(client.application.id, guildID),
        { body: commandDataList }
      );
    }
    console.log("Successfully reloaded command list");
  } catch (error) {
    console.error(error);
  }
}
