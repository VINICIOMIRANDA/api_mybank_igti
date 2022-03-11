import express from "express";
import winston from "winston";
import accountsRouter from "./routes/account.routes.js";
import { promises as fs } from "fs";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/index.js";

global.filename = "accounts.json";
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} : ${message}`;
});

global.loggers = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my_bank_api.log" }),
  ],
  format: combine(label({ label: "my_bank_api" }), timestamp(), myFormat),
});

/*const schema = buildSchema(`
  type Account  {
    id: Int
    name: String
    balance: Float
  }
  input AccountInput {
    id: Int
    name: String
    balance: Float
  }
  type Query {
    getAccounts: [Account]
    getAccount(id: Int):Account
  }
  type Mutation {
    createAccount(account: AccountInput): Account
    deleteAccount(id: Int): Boolean
    updateAccount(account: AccountInput): Account
  }
`);
*/
/*const root = {
  getAccounts: () => AccountService.getAccounts(),
  getAccount(args) {
    return AccountService.getAccountsId(args.id);
  },
  createAccount({ account }) {
    return AccountService.createAccount(account);
  },
  deleteAccount(args) {
    AccountService.deleteAccount(args.id);
  },
  updateAccount({ account }) {
    return AccountService.updateAccount(account);
  },
};*/

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/account", accountsRouter);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
 //   rootValue: root,
    graphiql: true
  })
);

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
