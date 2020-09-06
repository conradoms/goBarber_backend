import { getRepository } from 'typeorm';
import User from '../models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

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

    const token = sign({},
      '8e5b5a9c695f118c8acb2cd49118b99a', // md5Online - usar para gerar a palavra secreta
      {
        subject: user.id, // Sempre o id do usuario
        expiresIn: '1d'
      });

    return {
      user,
      token
    };
  }
}

export default AuthenticateUserService;
