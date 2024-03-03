import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Min(1)
  readonly stockQty: number;

  @IsNotEmpty()
  @Min(0)
  readonly price: number;
}
