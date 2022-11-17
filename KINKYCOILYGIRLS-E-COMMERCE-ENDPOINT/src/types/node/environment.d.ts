import { Keyable } from '../../utilities/interface';
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: 7000;
      DATABASE_URL: 'mongodb+srv://veehuelabs:admin%40veehuelabs.com@veehue.eaigm.mongodb.net/pizzarus?retryWrites=true&w=majority';
      JWT_SECRET: 'thisisnotsosecretive';
      STRIPE_SECRET: sk_test_6uTwljkHRk3Rx4549bi1Hrq5;
      STRIPE_PUBLIC: pk_test_Mm0rf6EdSdqxaeeDYGdlutgp;
      APP_URL: 'https://pizzarus.herokuapp.com';
    }
  }
}

export {};
