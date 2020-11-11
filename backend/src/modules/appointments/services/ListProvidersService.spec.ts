import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRespository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRespository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRespository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRespository.create({
      name: 'elto',
      email: 'elto@elto.com',
      password: '123456',
    });

    const user2 = await fakeUsersRespository.create({
      name: 'eltin',
      email: 'eltin@elto.com',
      password: '1234567',
    });

    const loggedUser = await fakeUsersRespository.create({
      name: 'tones',
      email: 'tones@elto.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
