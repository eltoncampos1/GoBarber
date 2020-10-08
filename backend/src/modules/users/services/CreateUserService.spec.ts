import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRespository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRespository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Elton',
      email: 'elto01@gmail.com',
      password: '123456 ',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new user with same email from another', async () => {
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
