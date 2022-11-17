import { connect } from 'mongoose';

const dbUrl: string | any = process.env.DATABASE_URL;

connect(dbUrl)
  .then((conn) => {
    console.log('DB Connected');
  })
  .catch((error) => {
    console.log('DB Error', error);
  });
