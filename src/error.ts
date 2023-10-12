import { Prisma } from "@prisma/client";

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AlreadyExistsError extends BaseError {
  constructor(
    modelName: Prisma.ModelName,
    propertyName: string,
    identifiedBy: string | number
  ) {
    super(
      `${modelName} identified by ${propertyName} ${identifiedBy} already exists`
    );
  }
}

export class ArgumentModelNotFoundError extends BaseError {
  constructor(
    modelName: Prisma.ModelName,
    propertyName: string,
    identifiedBy: string | string[]
  ) {
    const identifiedByComplete =
      typeof identifiedBy === "string" ? identifiedBy : identifiedBy.join(", ");
    const message = `Could not find instances of ${modelName} identified by ${propertyName}: ${identifiedByComplete}`;
    super(message);
  }
}

export class UnexpectedError extends BaseError {
  originalError: Error;
  constructor(originalError: Error, message = "An unexpected error occured") {
    super(message);
    this.originalError = originalError;
  }
}

export class ArgumentNotProvidedError extends BaseError {
  properties: string[];
  constructor(properties: string[]) {
    const message = "Arguments for " + properties.join(", ") + " must be given";
    super(message);
    this.properties = properties;
  }
}

export class UnknownCommandError extends BaseError {
  commandName: string;
  constructor(commandName: string, subCommand: boolean = true) {
    const message = `Unknown ${
      subCommand ? "sub" : ""
    }command ${commandName} provided`;
    super(message);
    this.commandName = commandName;
  }
}
