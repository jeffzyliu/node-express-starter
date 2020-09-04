import { Router } from 'express';
import { requireSignin } from '../services/passport';
import { UserController } from '../controllers';

const authRouter = Router();

authRouter.post('/signin', requireSignin, (req, res) => {
  try {
    const result = UserController.signin(req.user);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json('bad request');
  }
});

authRouter.post('/signup', async (req, res) => {
  try {
    const result = await UserController.signup(req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(422).json(error.message);
  }
});

export default authRouter;
