import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";
import cors from "cors";
import swaggerUi  from "swagger-ui-express";
import {swaggerDocument} from "./doc.js"

global.filename = "accounts.json";
const { combine, timestamp, label, printf} = winston.format;
const myFormat = printf(({level, message,label,timestamp})=>{
  return `${timestamp} [${label}] ${level} : ${message}` ;
})

global.loggers = winston.createLogger({
  level: "silly",
  transports : [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: "my_bank_api.log"})
  ],
  format: combine(
    label({ label:"my_bank_api"}),
    timestamp(),
    myFormat
  )
});

//const { readFile, writeFile} = fs;

const app = express();
app.use(cors());
app.use(express.json());


app.use("/account", accountsRouter);
app.use(express.static("public"));
app.use("/doc",swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000, async () => {
  try {
    await fs.readFile(global.filename);
    loggers.info("Api Started!! :) ");
  } catch (error) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    fs.writeFile(global.filename, JSON.stringify(initialJson))
      .then(() => {
        loggers.info("Api Started and file created :) ");
      })
      .catch((err) => {
        loggers.error(err);
      });
  }
});
