import {
  ChatInputCommandInteraction,
  hyperlink,
  bold,
  PermissionsBitField,
} from "discord.js";
import {
  CommandConfig,
  CommandNameEnum,
  KitaabAddOptionEnum,
  KitaabWasfAddOptionEnum,
  KitaabSubEnum,
} from "./type";
import {
  makeSlashCommand,
  makeStringOption,
  makeSubCommand,
  prisma,
  runWithThrowUnexpectedError,
} from "./util";
import translationData from "./translation-env.json";
import {
  AlreadyExistsError,
  ArgumentNotProvidedError,
  ArgumentModelNotFoundError,
  UnknownCommandError,
} from "./error";
import { Prisma } from "@prisma/client";

const td = translationData.description;

const { LIST_BOOKS, ADD_BOOK, ADD_TAG } = KitaabSubEnum;
const { BOOK_NAME, BOOK_DESCRIPTION, BOOK_TAGS, BOOK_LINK } =
  KitaabAddOptionEnum;
const { TAG_NAME, TAG_DESCRIPTION } = KitaabWasfAddOptionEnum;

export default [
  {
    name: CommandNameEnum.SALAAM,
    data: makeSlashCommand(CommandNameEnum.SALAAM, "Assalamu Alaykum!"),
    async execute(interaction) {
      await interaction.reply(
        "وَعَلَيْكُمُ ٱلسَّلَامُ (!wa-Alaykumu s-salaamu)"
      );
    },
  },
  {
    name: CommandNameEnum.KITAAB,
    data: makeSlashCommand(CommandNameEnum.KITAAB, `Books! | ${td.books}`)
      .addSubcommand((subcommand) =>
        makeSubCommand(subcommand, LIST_BOOKS, `List Books | ${td.list_books}`)
      )
      .addSubcommand((subcommand) =>
        makeSubCommand(subcommand, ADD_BOOK, `Add Book | ${td.add_book}`)
          // TODO: Validation incluing string length
          .addStringOption((option) =>
            makeStringOption(
              option,
              BOOK_NAME,
              `Name of Book | ${td.book_name}`
            )
          )
          .addStringOption((option) =>
            makeStringOption(
              option,
              BOOK_DESCRIPTION,
              `Description of Book | ${td.book_description}`
            )
          )
          .addStringOption((option) =>
            makeStringOption(option, BOOK_TAGS, `Book Tags | ${td.book_tags}`)
          )
          .addStringOption((option) =>
            makeStringOption(option, BOOK_LINK, `Book Link | ${td.book_link}`)
          )
      )
      .addSubcommand((subcommand) =>
        makeSubCommand(subcommand, ADD_TAG, `Add Tag | ${td.add_tag}`)
          .addStringOption((option) =>
            makeStringOption(option, TAG_NAME, `Name of Tag | ${td.tag_name}`)
          )
          .addStringOption((option) =>
            makeStringOption(
              option,
              TAG_DESCRIPTION,
              `Description of Tag | ${td.tag_description}`
            )
          )
      ),
    async execute(interaction: ChatInputCommandInteraction) {
      const subName = interaction.options.getSubcommand();
      switch (subName as KitaabSubEnum) {
        case KitaabSubEnum.ADD_TAG: {
          const name = interaction.options.getString(TAG_NAME) || "";
          const description =
            interaction.options.getString(TAG_DESCRIPTION) || "";
          if ([name, description].some((item) => item.length === 0)) {
            throw new ArgumentNotProvidedError(["name", "description"]);
          }
          runWithThrowUnexpectedError(async () => {
            let foundBookList = await prisma.book.findMany({
              where: { name: name },
            });
            if (foundBookList.length > 0) {
              throw new AlreadyExistsError(
                Prisma.ModelName.BookTag,
                "name",
                name
              );
            }
            await prisma.bookTag.create({
              data: {
                name,
                description,
              },
            });
            await interaction.reply("Book Tag successfully added!");
          });
          break;
        }
        case KitaabSubEnum.LIST_BOOKS: {
          const bookList = await prisma.book.findMany({
            include: {
              tags: true,
            },
          });
          let isAdmin = false;
          if (
            interaction.memberPermissions?.has(
              PermissionsBitField.Flags.Administrator
            )
          ) {
            isAdmin = true;
          }

          const lineList = bookList.map((item, idx) => {
            const tagString = item.tags.map((tag) => tag.name).join(",");
            const link = hyperlink(item.name, item.link);
            const line = `${idx + 1}: ${link} ${
              isAdmin ? "(ID: " + item.ID + ")" : ""
            } (${tagString})`;
            return line;
          });

          const title = bold(`Books | ${td.books}`);
          const response = `${title}\n\n${lineList.join("\n")}`;

          await interaction.reply(response);

          break;
        }
        case KitaabSubEnum.ADD_BOOK: {
          const name = interaction.options.getString(BOOK_NAME) || "";
          const description =
            interaction.options.getString(BOOK_DESCRIPTION) || "";
          const bookTagsRaw = interaction.options.getString(BOOK_TAGS) || "";
          const link = interaction.options.getString(BOOK_LINK) || "";
          if (
            [name, description, bookTagsRaw, link].some(
              (item) => !item || item.length === 0
            )
          ) {
            throw new ArgumentNotProvidedError([
              "name",
              "description",
              "bookTags",
              "link",
            ]);
          }
          const bookTags = bookTagsRaw.split(",");
          runWithThrowUnexpectedError(async () => {
            let foundBookList = await prisma.book.findMany({
              where: { name: name },
            });
            if (foundBookList.length > 0) {
              throw new AlreadyExistsError(Prisma.ModelName.Book, "name", name);
            }
            foundBookList = await prisma.book.findMany({
              where: { link: link },
            });
            if (foundBookList.length > 0) {
              throw new AlreadyExistsError(Prisma.ModelName.Book, "link", link);
            }
            const retrievedTags = await prisma.bookTag.findMany({
              where: {
                name: {
                  in: bookTags,
                },
              },
            });
            if (retrievedTags.length !== bookTags.length) {
              const nameListRetrievedTags = retrievedTags.map(
                (item) => item.name
              );
              const tagsNotFound: string[] = [];
              for (const tagName of bookTags) {
                if (!nameListRetrievedTags.includes(tagName)) {
                  tagsNotFound.push(tagName);
                }
              }
              throw new ArgumentModelNotFoundError(
                Prisma.ModelName.BookTag,
                "name",
                tagsNotFound
              );
            }
            await prisma.book.create({
              data: {
                name,
                description,
                link,
                tags: {
                  connect: [...retrievedTags.map((item) => ({ ID: item.ID }))],
                },
              },
              include: {
                tags: true,
              },
            });
            await interaction.reply("Book successfully added!");
          });
          break;
        }
        default: {
          throw new UnknownCommandError(subName);
        }
      }
    },
  },
] as CommandConfig[];
