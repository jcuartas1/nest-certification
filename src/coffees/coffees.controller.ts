import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Put } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDtoTs } from './dto/create-coffee.dto.ts/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto.ts/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffesService: CoffeesService
  ){}

  @Get()
  findAll(@Query() paginationQuery){
    //const { limit, offset } = paginationQuery;
    return this.coffesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: number){
    return this.coffesService.findOne('' + id)
  }

  @Post()
  create(@Body() createcoffeDto: CreateCoffeeDtoTs){
    console.log(createcoffeDto instanceof CreateCoffeeDtoTs)
    return this.coffesService.create(createcoffeDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto){
    return this.coffesService.update(id, updateCoffeeDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string){
    return this.coffesService.remove(id)
  }
}
