import { Collection, CommandInteraction, Routes } from "discord.js";
import commandList from "./command";
import { MyClient } from "./type";
import { discordREST } from "./util";
import { BaseError, UnexpectedError } from "./error";

export async function handleSaveSlashCommandList(client: MyClient) {
  client.commands = new Collection();
  commandList.forEach((command) => {
    const executor = async (interaction: CommandInteraction) => {
      try {
        command.execute(interaction);
      } catch (error) {
        if (error instanceof BaseError) {
          await interaction.reply(error.message);
        }
        if (error instanceof UnexpectedError) {
          console.error(error.originalError);
        } else {
          console.error(error);
        }
      }
    };
    client.commands.set(command.data.name, executor);
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
