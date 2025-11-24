import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
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
        name: 'TestKedisiV2',
        age: 2,
        breed: 'Test',
        gender: Gender.Male,
      };

      const initialCount = service.findAll().length;

      service.create(createCatDto);
      const cats = service.findAll();

      // GÜNCELLEME: Mevcut veriye +1 eklendiğini doğrula
      expect(cats.length).toBe(initialCount + 1);
      expect(cats).toContainEqual(createCatDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const cats = service.findAll();
      expect(Array.isArray(cats)).toBe(true);
    });

    it('should return limited number of cats if limit is provided', () => {
      // Test için yeterli veri olduğundan emin olalım
      service.create({ name: 'C1', age: 1, breed: 'B', gender: Gender.Male });
      service.create({ name: 'C2', age: 1, breed: 'B', gender: Gender.Male });

      const limit = 1;
      const cats = service.findAll(limit);
      expect(cats.length).toBeLessThanOrEqual(limit);
    });
  });
});
