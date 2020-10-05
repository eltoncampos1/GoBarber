// import AppError from '@shared/errors/AppErrors';
import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';

let fakeUsersRespository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPaswordService', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRespository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Elto',
      email: 'elto01@gmail.com',
      password: '1234567',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUsersRespository.findById(user.id);

    expect(generateHash).toBeCalledWith('123123');

    expect(updatedUser?.password).toBe('123123');
  });

  it('not should be able to reset password with a non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing token',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('not should be able to reset password with a non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing user',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than two hours', async () => {
    const user = await fakeUsersRespository.create({
      name: 'Elto',
      email: 'elto01@gmail.com',
      password: '1234567',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
