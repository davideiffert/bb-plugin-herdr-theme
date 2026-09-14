import { defineRpcContract, type StandardSchemaV1 } from "@get-bb/plugin-sdk";
import catalog from "./palettes/catalog.json";
const ids = new Set(catalog.map(p => `plugin:herdr-theme:${p.id}`));
function schema<T>(accept: (value: unknown) => value is T): StandardSchemaV1<T> {
  return { "~standard": { version: 1, vendor: "herdr-theme", validate: value =>
    accept(value) ? { value } : { issues: [{ message: "Invalid palette request" }] } } };
}
const selection = schema<string>((v): v is string => typeof v === "string" && ids.has(v));
const text = schema<string>((v): v is string => typeof v === "string");
export const contract = defineRpcContract({ select: { input: selection, output: text } });
