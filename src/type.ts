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

export enum KitaabSubEnum {
  LIST_BOOKS = "list-books",
  ADD_BOOK = "add-book",
  DELETE_BOOK = "delete-book",

  LIST_TAGS = "list-tags",
  ADD_TAG = "add-tag",
  DELETE_TAG = "delete-tag",
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
