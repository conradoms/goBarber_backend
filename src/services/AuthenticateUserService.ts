import { getRepository } from 'typeorm';
import User from '../models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import auth from '../config/auth';

interface Request {
  email: string,
  password: string,
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<{ user: User, token: string }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error('Incorrect e-mail/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect e-mail/password combination.');
    }

    const { secret, expiresIn } = auth.jwt;

    const token = sign({},
      secret,
      {
        subject: user.id, // Sempre o id do usuario
        expiresIn
      });

    return {
      user,
      token
    };
  }
}

export default AuthenticateUserService;
