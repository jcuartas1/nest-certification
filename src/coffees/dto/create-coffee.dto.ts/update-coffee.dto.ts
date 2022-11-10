import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDtoTs } from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDtoTs){}
