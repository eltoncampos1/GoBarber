import FakeMailProvider from '@shared/container/providers/mailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRespository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRespository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRespository.create({
      name: 'Elto',
      email: 'elto01@gmail.com',
      password: '1234567',
    });

    await sendForgotPasswordEmail.execute({
      email: 'elto01@gmail.com',
    });

    expect(sendMail).toBeCalled();
  });

  it('should not be able to  recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'elto01@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRespository.create({
      name: 'Elto',
      email: 'elto01@gmail.com',
      password: '1234567',
    });

    await sendForgotPasswordEmail.execute({
      email: 'elto01@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
