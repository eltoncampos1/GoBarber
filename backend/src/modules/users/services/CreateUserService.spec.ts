import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRespository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRespository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Elton',
      email: 'elto01@gmail.com',
      password: '123456 ',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new user with same email from another', async () => {
    const fakeUsersRespository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRespository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Elton',
      email: 'elto01@gmail.com',
      password: '123456 ',
    });

    await expect(
      createUser.execute({
        name: 'Elton',
        email: 'elto01@gmail.com',
        password: '123456 ',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
