import { Stripe } from 'stripe';
import { Keyable } from './interface';

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: '2020-08-27',
});

const generatePaymentSession = async (data: Array<Keyable>): Promise<any> => {
  let config: any = {
    payment_method_types: ['card'],
    line_items: data,
    mode: 'payment',
    success_url: `${process.env.APP_URL}/success`,
    cancel_url: `${process.env.APP_URL}/cancel`,
  };
  const session = await stripe.checkout.sessions.create(config);
  return [session.url, config];
};

export { generatePaymentSession };
