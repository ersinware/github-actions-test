import { Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';
import { Gender } from './enums/gender.enum';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
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

  create(createCatDto: CreateCatDto): void {
    this.cats.push(createCatDto);
  }

  findAll(limit?: number): Cat[] {
    if (limit) return this.cats.slice(0, limit);

    return this.cats;
  }

  findOne(name: string): Cat {
    const cat = this.cats.find((cat) => cat.name === name);

    if (!cat) throw new NotFoundException(`Cat with name ${name} not found`);

    return cat;
  }
}
