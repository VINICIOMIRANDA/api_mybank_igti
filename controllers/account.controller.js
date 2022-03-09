import AccountService from "../services/account.service.js";


async function createAccount(req, res, next) {
  try {
    let account = req.body;
    if (!account.name || account.balance == null) {
      throw new Error("Name e Balance são obrigatórios");
    }
    account = await AccountService.createAccount(account);
    loggers.info(`${req.method} ${JSON.stringify(account)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
}

async function getAccounts(req, res, next) {
  try {
    res.send(await AccountService.getAccounts());
    global.loggers.info(`${req.method} ${req.baseUrl}`);
  } catch (err) {
    next(err);
  }
}

async function getAccountsId(req, res, next) {
  try {
   
    res.send(await AccountService.getAccountsId(req.params.id));
    global.loggers.info(`${req.method} ${req.baseUrl}`);
  } catch (err) {
    next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    await AccountService.deleteAccount(req.params.id)
    res.end();
    global.loggers.info(`${req.method} ${req.baseUrl} :id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const account = req.body;

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("ID, Name e Balance são obrigatórios");
    }
   
    res.send(await AccountService.updateAccount(account));
    global.loggers.info(`${req.method} ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
}

async function updateBalance(req, res, next) {
  try {
    const account = req.body;
    if (!account.id || account.balance == null) {
      throw new Error("ID e Balance são obrigatórios");
    }
    global.loggers.info(`${req.method} ${JSON.stringify(account)}`);
    res.send(await AccountService.updateBalance(account));
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
  updateBalance,
};
