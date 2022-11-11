import { HttpException, Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDtoTs } from './dto/create-coffee.dto.ts/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto.ts/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto';
import { EventEntity } from '../events/entities/event.entity/event.entity';

@Injectable()
export class CoffeesService {
  
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
  ){}

  async findAll(paginationQueryDto: PaginationQueryDto){
    const { limit, offset} = paginationQueryDto;
    return await this.coffeeRepository.find({
      relations:{
        flavors: true
      },
      skip: offset,
      take: limit
    });
  }

  async findOne(id: string){
    const coffee = await this.coffeeRepository.findOne({ 
      where: {id: +id},
      relations: {
        flavors: true
      }
    })
    if(!coffee){
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeDto: CreateCoffeeDtoTs){

    const flavors = await Promise.all(
      createCoffeDto.flavors.map(name => this.preloadFlavorByName(name))
    )

    const coffee = this.coffeeRepository.create({
      ...createCoffeDto,
      flavors,
    });
    return await this.coffeeRepository.save(coffee)
  }

  async update(id: string, updateCoffeDto: UpdateCoffeeDto){

    const flavors = 
      updateCoffeDto.flavors && (await Promise.all(updateCoffeDto.flavors.map(name => this.preloadFlavorByName(name))))

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeDto,
      flavors
    })
    if(!coffee){
      throw new NotFoundException(`Coffee ${id} not found!`);
    }
    return await this.coffeeRepository.save(coffee)
  }

  async remove(id: string){
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee)
  }

  async recommendCoffee(coffee: Coffee){
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;

      const recommendEvent = new EventEntity();
      recommendEvent.name = 'recommend_coffe';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id }

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor>{
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    })
    if(existingFlavor){
      return existingFlavor;
    }
    return this.flavorRepository.create({name})
  }

}
