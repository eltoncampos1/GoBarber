import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRespository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRespository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRespository.create({
      name: 'elto',
      email: 'elto@elto.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('elto');
    expect(profile.email).toBe('elto@elto.com');
  });

  it('should not be able to show the profile from a non-existing user.', async () => {
    expect(
      showProfile.execute({
        user_id: 'non-existing user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
