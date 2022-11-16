import { PartialType } from "@nestjs/swagger";
import { CreateCoffeeDtoTs } from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDtoTs){}
