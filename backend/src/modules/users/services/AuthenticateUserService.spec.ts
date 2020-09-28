import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersReposotory';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('Authenticate', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRespository = new FakeUsersRepository();
    const fakeHasheProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRespository,
      fakeHasheProvider,
    );
    const createUser = new CreateUserService(
      fakeUsersRespository,
      fakeHasheProvider,
    );

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
    const fakeUsersRespository = new FakeUsersRepository();
    const fakeHasheProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRespository,
      fakeHasheProvider,
    );

    expect(
      authenticateUser.execute({
        email: 'elto01@gmail.com',
        password: '123456 ',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRespository = new FakeUsersRepository();
    const fakeHasheProvider = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRespository,
      fakeHasheProvider,
    );
    const createUser = new CreateUserService(
      fakeUsersRespository,
      fakeHasheProvider,
    );

    await createUser.execute({
      name: 'Elto',
      email: 'elto01@gmail.com',
      password: '123456 ',
    });

    expect(
      authenticateUser.execute({
        email: 'elto01@gmail.com',
        password: 'wrong-password ',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});