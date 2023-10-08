import {
  Client,
  Collection,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export enum CommandNameEnum {
  SALAAM = "salaam",
}

export type CommandInteractionHandler = (
  interaction: CommandInteraction
) => Promise<void>;

export type CommandConfig = {
  data: SlashCommandBuilder;
  execute: CommandInteractionHandler;
};

export interface MyClient extends Client {
  commands: Collection<string, CommandInteractionHandler>;
}
