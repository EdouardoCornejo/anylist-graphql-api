import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/core/lists/entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/core/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { UpdateListInput } from 'src/core/lists/dto/update-list.input';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({ ...createListInput, user });
    return await this.listRepository.save(newList);
  }

  findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Array<List>> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('lOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });

    if (!list) throw new NotFoundException(`List with id ${id} not found`);

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);
    const list = await this.listRepository.preload({
      ...updateListInput,
      user,
    });

    if (!list) throw new NotFoundException(`List with id ${id} not found`);

    return this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listRepository.remove(list);
    return { ...list, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
