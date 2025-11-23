import { Gender } from "../enums/gender.enum";

export interface Cat {
  name: string;
  age: number;
  breed: string;
  gender: Gender
}
