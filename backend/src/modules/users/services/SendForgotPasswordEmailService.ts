import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';
import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

// import User from '../infra/typeorm/entities/User';

interface Request {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(email, 'Pedido de recuperação de senha');
  }
}

export default SendForgotPasswordEmailService;
