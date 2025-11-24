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
        name: 'TestKedisi',
        age: 2,
        breed: 'Test',
        gender: Gender.Female,
      };

      // Mevcut sayıyı al
      const initialCount = service.findAll().length;

      service.create(createCatDto);
      const cats = service.findAll();

      // GÜNCELLEME: Kesin sayı yerine artışı kontrol et
      expect(cats.length).toBe(initialCount + 1);
      // Eklenen kedinin listede olduğunu doğrula
      expect(cats).toContainEqual(createCatDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const cats = service.findAll();
      expect(Array.isArray(cats)).toBe(true);
    });
  });
});
