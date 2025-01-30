import * as mongoose from 'mongoose';
import { environment } from '../config/env';

export function configureDatabase() {
  mongoose.set('strictQuery', false);

  mongoose.connect(
    // tslint:disable-next-line:max-line-length
    environment.db.mongoUri,
    { dbName: 'test' },
  ).then(() => {
    console.log('Connection to the Atlas Cluster is successful!');
  })
    .catch((err) => {
      console.error(err);
      console.error('Make sure your IP has been whitelisted!');
    });
}
