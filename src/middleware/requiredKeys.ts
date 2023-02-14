import { allRequiredKeysPresent } from '../utils/helpers';

const userRequiredKeys = ['username', 'password'];
const commentRequiredKeys=['post','content']
export const signUpKeysMiddleware = allRequiredKeysPresent(userRequiredKeys)
export const commentKeysMiddleware= allRequiredKeysPresent(commentRequiredKeys)