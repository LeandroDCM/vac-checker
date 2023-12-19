import csvToJson from "csvtojson";

async function parseCsvString(string: string): Promise<any[]> {
  const result = await csvToJson().fromString(string);
  return result;
}

async function parseCsvFile(filePath: string): Promise<any[]> {
  const result = await csvToJson().fromFile(filePath);
  return result;
}

export { parseCsvString, parseCsvFile };
