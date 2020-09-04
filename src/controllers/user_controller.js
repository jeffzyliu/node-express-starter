import jwt from 'jwt-simple';
import { Users } from '../models';

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

function signin(user) {
  return { token: tokenForUser(user), username: user.username };
}

async function signup(body) {
  const { email, password, username } = body;
  if (!email || !password) {
    throw new Error('You must provide email and password');
  }
  const user = await Users.findOne({ email });
  if (user) throw new Error('email already exists');
  const newUser = new Users({ email, password, username });
  await newUser.save();
  return { token: tokenForUser(newUser), username: newUser.username };
}

export default { signin, signup };
