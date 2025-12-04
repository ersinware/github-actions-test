import { Injectable, NotFoundException } from '@nestjs/common';
import { CatDto } from './dto/cat.dto';
import { Gender } from './enums/gender.enum';

@Injectable()
export class CatsService {
  private readonly cats: CatDto[] = [
    {
      name: 'Garfield',
      age: 5,
      breed: 'Tabby',
      gender: Gender.Female,
    },
    {
      name: 'Mittens',
      age: 3,
      breed: 'Siamese',
      gender: Gender.Male,
    },
  ];

  create(createCatDto: CatDto): void {
    this.cats.push(createCatDto);
  }

  findAll(limit?: number): CatDto[] {
    if (limit) return this.cats.slice(0, limit);

    return this.cats;
  }

  findOne(name: string): CatDto {
    const cat = this.cats.find((cat) => cat.name === name);

    if (!cat) throw new NotFoundException(`Cat with name ${name} not found`);

    return cat;
  }
}
