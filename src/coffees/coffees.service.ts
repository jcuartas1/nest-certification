import { HttpException, Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Moccachino',
      brand: 'Juan Valdes',
      flavors: ['mate', 'vanilla'],
    }
  ];

  findAll(){
    return this.coffees;
  }

  findOne(id: string){
    const coffee = this.coffees.find(item => item.id === +id);
    if(!coffee){
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeDto: any){
    this.coffees.push(createCoffeDto)
  }

  update(id: string, updateCoffeDto: any){
    const existingCoffee = this.findOne(id);
    // if(existingCoffee){

    // }
  }

  remove(id: string){
    const coffeIndex = this.coffees.findIndex(item => item.id === +id);
    if(coffeIndex >= 0){
      this.coffees.splice(coffeIndex, 1);
    }
  }




}
