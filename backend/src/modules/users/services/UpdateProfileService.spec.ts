import AppError from '@shared/errors/AppErrors';

import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRespository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRespository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRespository.create({
      name: 'elto',
      email: 'elto@elto.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Eltin',
      email: 'eltin@eltin.com',
    });

    expect(updatedUser.name).toBe('Eltin');
    expect(updatedUser.email).toBe('eltin@eltin.com');
  });

  it('should not be able to update the profile from a non-existing user.', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing user_id',
        name: 'Test',
        email: 'teste@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRespository.create({
      name: 'elto',
      email: 'elto@elto.com',
      password: '123456',
    });

    const user = await fakeUsersRespository.create({
      name: 'teste',
      email: 'teste@elto.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Eltin',
        email: 'elto@elto.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRespository.create({
      name: 'elto',
      email: 'elto@elto.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Eltin',
      email: 'eltin@eltin.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRespository.create({
      name: 'elto',
      email: 'elto@elto.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Eltin',
        email: 'eltin@eltin.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRespository.create({
      name: 'elto',
      email: 'elto@elto.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Eltin',
        email: 'eltin@eltin.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
