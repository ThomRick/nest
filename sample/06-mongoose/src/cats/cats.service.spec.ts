import { TestingModule, Test } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';

describe('CatsService', () => {
  let service: CatsService;
  let repository: Model<Cat> & jest.Mock<Model<Cat>>;

  const mock: any = {
    save: jest.fn(),
    find: jest.fn().mockImplementation(() => ({
      exec: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getModelToken('Cat'),
          useValue: (() => {
            const model: any = jest.fn().mockImplementation(() => mock);
            Object.keys(mock).forEach((key) => {
              model[key] = mock[key];
            });
            return model;
          })(),
        },
      ],
    })
    .compile();
    service = module.get(CatsService);
    repository = module.get(getModelToken('Cat'));
  });

  it('should save the cat in the repository', async () => {
    const dto = new CreateCatDto('name', 1, 'maincoon');

    await service.create(dto);

    expect(repository).toHaveBeenCalled();
    expect(mock.save).toHaveBeenCalled();
  });

  it('should query all cats from repositoey', async () => {
    const expected: Cat[] = [
      { name: 'name', age: 1, breed: 'maincoon' } as Cat,
    ];
    mock.find.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(expected),
    }));

    const result: Cat[] = await service.findAll();

    expect(mock.find).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});
