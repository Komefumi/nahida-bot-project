import {
  Client,
  Collection,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export enum CommandNameEnum {
  SALAAM = "salaam",
  KITAAB = "kitaab",
}

export type CommandInteractionHandler = (
  interaction: CommandInteraction
) => void;

export type CommandConfig = {
  name: CommandNameEnum;
  data: SlashCommandBuilder;
  execute: CommandInteractionHandler;
};

export interface MyClient extends Client {
  commands: Collection<string, CommandInteractionHandler>;
}
