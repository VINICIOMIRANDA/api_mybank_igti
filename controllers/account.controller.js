import { promises as fs } from "fs";
const { readFile, writeFile } = fs;

async function createAccount(req, res, next) {
  try {
    let account = req.body;

    if (!account.name || account.balance == null) {
      throw new Error("Name e Balance são obrigatórios");
    }
    const data = JSON.parse(await readFile(global.filename));

    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance,
    };

    data.accounts.push(account);

    await writeFile(global.filename, JSON.stringify(data, null, 2)); // sobreescreve
    // await writeFile("accounts.json", JSON.stringify(data);

    global.loggers.info(`${req.method} ${JSON.stringify(account)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
}

async function getAccounts(req, res, next) {
  try {
    const data = JSON.parse(await readFile(global.filename));
    delete data.nextId;
    res.send(data);
    global.loggers.info(`${req.method} ${req.baseUrl}`);
  } catch (err) {
    next(err);
  }
}

async function getAccountsId(req, res, next) {
  try {
    const data = JSON.parse(await readFile(global.filename));
    const account = data.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    res.send(account);
    global.loggers.info(`${req.method} ${req.baseUrl}`);
  } catch (err) {
    next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const data = JSON.parse(await readFile(global.filename));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );

    await writeFile(global.filename, JSON.stringify(data, null, 2));
    res.end();
    global.loggers.info(`${req.method} ${req.baseUrl} :id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.filename));

    const index = data.accounts.findIndex((a) => a.id === account.id);

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("ID, Name e Balance são obrigatórios");
    }

    if (index === -1) {
      throw new Error("Registro não encontrado");
    }

    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(global.filename, JSON.stringify(data, null, 2));

    res.send(account);
    global.loggers.info(`${req.method} ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
}

async function updateBalance(req, res, next){
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.filename));

    const index = data.accounts.findIndex((a) => a.id === account.id);

    if (!account.id || account.balance == null) {
      throw new Error("ID e Balance são obrigatórios");
    }

    if (index === -1) {
      throw new Error("Registro não encontrado");
    }

    data.accounts[index].balance = account.balance;

    await writeFile(global.filename, JSON.stringify(data, null, 2));
    global.loggers.info(`${req.method} ${JSON.stringify(account)}`);
    res.send(data.accounts[index]);
  } catch (err) {
    next(err);
  }
}


export default {
  createAccount,
  getAccounts,
  getAccountsId,
  deleteAccount,
  updateAccount,
  updateBalance
};
