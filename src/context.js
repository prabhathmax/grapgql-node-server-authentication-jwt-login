import Knex from 'knex';
import 'dotenv/config';
import { SecretsCache, DbSecrets, JwtSecret } from './helpers/secretsCache';
import AccountRepository from './domain/account/repository';
import AccountService from './domain/account/service';
import AuthenticationService from "./domain/authentication/service";

const createContext = async () => {
  const secretsCache = new SecretsCache();
  const dbSecrets = new DbSecrets(secretsCache);
  const jwtSecret = new JwtSecret(secretsCache);
  const knex = Knex({
    client: 'mysql',
    connection: await dbSecrets.getAsKnex(),
    pool: { min: 0, max: 7 },
    useNullAsDefault: true,
  });
  const accountRepository = new AccountRepository(knex);
  const accountService = new AccountService(accountRepository);
  const authenticationService = new AuthenticationService(accountService, jwtSecret);
  return {
    secrets: {
      db: dbSecrets,
    },
    repositories: {
      account: accountRepository,
    },
    services: {
      account: accountService,
      authentication: authenticationService,
    },
  };
};

export default createContext;
