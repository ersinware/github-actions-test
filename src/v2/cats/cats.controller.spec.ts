import { Test, TestingModule } from '@nestjs/testing';
import { CatsControllerV2 } from './cats.controller';
import { CatsService } from './cats.service';
import { CatDto } from './dto/cat.dto';
import { Gender } from './enums/gender.enum';
import { FindOneCatDto } from './dto/find-one-cat.dto';

describe('CatsControllerV2', () => {
  let controller: CatsControllerV2;
  let service: CatsService;

  const mockCatsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsControllerV2],
      providers: [
        {
          provide: CatsService,
          useValue: mockCatsService,
        },
      ],
    }).compile();

    controller = module.get<CatsControllerV2>(CatsControllerV2);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cat', () => {
      const createCatDto: CatDto = {
        name: 'Pamuk',
        age: 1,
        breed: 'Van',
        gender: Gender.Male,
      };

      // Fix: Spy on the method explicitly
      const createSpy = jest.spyOn(service, 'create').mockImplementation(() => undefined);

      const result = controller.create(createCatDto);

      expect(result).toBe('This action adds a new cat');
      expect(createSpy).toHaveBeenCalledWith(createCatDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const result: CatDto[] = [{ name: 'Duman', age: 3, breed: 'British', gender: Gender.Male }];

      const findAllSpy = jest.spyOn(service, 'findAll').mockImplementation(() => result);

      expect(controller.findAll({})).toEqual(result);
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single cat', () => {
      const result: CatDto = {
        name: 'Duman',
        age: 3,
        breed: 'British',
        gender: Gender.Male,
      };
      const params: FindOneCatDto = { name: 'Duman' };

      const findOneSpy = jest.spyOn(service, 'findOne').mockImplementation(() => result);

      expect(controller.findOne(params)).toEqual(result);
      expect(findOneSpy).toHaveBeenCalledWith(params.name);
    });
  });
});
