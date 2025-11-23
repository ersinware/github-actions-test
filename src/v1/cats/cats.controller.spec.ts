import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interface/cat.interface';
import { Gender } from './enums/gender.enum';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  const mockCatsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: mockCatsService,
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cat', () => {
      const createCatDto: CreateCatDto = {
        name: 'Pamuk',
        age: 1,
        breed: 'Van',
        gender: Gender.Male,
      };

      const createSpy = jest
        .spyOn(service, 'create')
        .mockImplementation(() => undefined);

      const result = controller.create(createCatDto);

      expect(result).toBe('This action adds a new cat');

      expect(createSpy).toHaveBeenCalledWith(createCatDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const result: Cat[] = [
        { name: 'Duman', age: 3, breed: 'British', gender: Gender.Male },
      ];

      jest.spyOn(service, 'findAll').mockImplementation(() => result);

      expect(controller.findAll()).toEqual(result);
    });
  });
});
