import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRespository: FakeUsersRepository;
let fakeHasheProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('Authenticate', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeHasheProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRespository,
      fakeHasheProvider,
    );
    createUser = new CreateUserService(fakeUsersRespository, fakeHasheProvider);
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Elto',
      email: 'elto01@gmail.com',
      password: '123456 ',
    });

    const response = await authenticateUser.execute({
      email: 'elto01@gmail.com',
      password: '123456 ',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'elto01@gmail.com',
        password: '123456 ',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Elto',
      email: 'elto01@gmail.com',
      password: '123456 ',
    });

    await expect(
      authenticateUser.execute({
        email: 'elto01@gmail.com',
        password: 'wrong-password ',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
