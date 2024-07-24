import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from 'src/core/items/entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);

    return this.itemsRepository.save(newItem);
  }

  async findAll(): Promise<Array<Item>> {
    return this.itemsRepository.find();
  }

  findOne(id: string): Promise<Item> {
    const item = this.itemsRepository.findOneBy({ id });

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return this.itemsRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    //TODO: Soft delete
    //TODO?: Integrity referencial check

    const item = await this.findOne(id);

    await this.itemsRepository.remove(item);

    return { ...item, id };
  }
}
