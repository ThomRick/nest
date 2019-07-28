import { TestingModule, Test } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CatsController,
      ],
      providers: [
        CatsService,
      ],
    })
    .overrideProvider(CatsService)
    .useValue({
      create: jest.fn(),
      findAll: jest.fn(),
    })
    .compile();
    controller = module.get(CatsController);
    service = module.get(CatsService);
  });

  it('should create a new cat', async () => {
    const dto = new CreateCatDto('name', 1, 'maincoon');

    await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should find all cats', async () => {
    const expected: Cat[] = [
      { name: 'name', age: 1, breed: 'maincoon' } as Cat,
    ];
    (service.findAll as jest.Mock).mockResolvedValueOnce(expected);

    const response: Cat[] = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(response).toEqual(expected);
  });
});
