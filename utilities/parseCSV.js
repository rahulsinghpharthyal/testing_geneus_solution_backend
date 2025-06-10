import fs from "fs";
import path from "path";
import csv from "csv-parser";

const stockList = [];
const filePath = path.resolve("data", "EQUITY_L.csv");

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    stockList.push({
      companyName: row["NAME OF COMPANY"],
      symbol: row["SYMBOL"],
      isin: row[" ISIN NUMBER"].trim(),
    });
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });

export { stockList };
