import * as path from "path";
import * as fs from "fs";
import mime from "mime-types";

export function getBase64Url(filePath: string, type?: string) {
  const absPath = path.resolve(process.cwd(), filePath);
  const file = fs.readFileSync(absPath);

  const mimeType = type || mime.contentType(path.extname(absPath));
  const url = `data:${mimeType};base64,` + Buffer.from(file).toString("base64");

  return url;
}
