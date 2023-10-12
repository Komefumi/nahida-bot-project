import translationData from "../src/translation-env.json";
import * as path from "path";
import * as fs from "fs";

const emptyData = Object.assign({}, translationData);

function recursivelyEmpty(
  data: Record<string, string | { [key: string]: string }>
) {
  for (const key in data) {
    const value = data[key];
    if (value instanceof Object) {
      recursivelyEmpty(value);
    } else {
      data[key] = "";
    }
  }
}

recursivelyEmpty(emptyData);

fs.writeFileSync(
  path.join(__dirname, "..", "src", "translation-base.json"),
  JSON.stringify(emptyData, null, 2)
);
