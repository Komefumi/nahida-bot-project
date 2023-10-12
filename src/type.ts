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

export enum KitaabAddOptionEnum {
  BOOK_NAME = "book_name",
  BOOK_DESCRIPTION = "book_description",
  BOOK_TAGS = "book_tags",
  BOOK_LINK = "book_link",
}

export enum KitaabWasfAddOptionEnum {
  TAG_NAME = "tag_name",
  TAG_DESCRIPTION = "tag_description",
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
