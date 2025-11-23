import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interface/cat.interface';
import { Gender } from './enums/gender.enum';

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should add a cat to the array', () => {
      const createCatDto: CreateCatDto = {
        name: 'Tekir',
        age: 2,
        breed: 'Sokak Kedisi',
        gender: Gender.Female,
      };

      service.create(createCatDto);
      const cats = service.findAll();

      expect(cats).toHaveLength(1);
      expect(cats[0]).toEqual(createCatDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const result: Cat[] = [];
      expect(service.findAll()).toEqual(result);
    });
  });
});
