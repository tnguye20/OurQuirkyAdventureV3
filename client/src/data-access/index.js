import { db } from '../utils';
import { DAO } from './DAO';

const MemoriesDAO = DAO({db, collection: 'memories'});
const UsersDAO = DAO({db, collection: 'users'});

export {
  MemoriesDAO,
  UsersDAO
};
