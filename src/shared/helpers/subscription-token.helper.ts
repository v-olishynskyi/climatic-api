import { createHash } from 'crypto';

export const generateSubscriptionToken = (email: string) => {
  // generate token for subscription
  const payloadString = `${email}${new Date().getTime()}`;
  const hash = createHash('sha256');
  const subscriptionToken = hash.update(payloadString).digest('hex');

  return subscriptionToken;
};
