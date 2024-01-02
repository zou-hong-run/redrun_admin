import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { Dept } from './entities/dept.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DeptService {
  @InjectRepository(Dept)
  private deptRepository: Repository<Dept>;
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async create(createDeptDto: CreateDeptDto) {
    let dept_name = createDeptDto.dept_name;
    let parent_id = createDeptDto.parentId;
    let parentDept = await this.deptRepository.findOne({
      where: {
        id: parent_id,
      },
    });
    let dept = new Dept();
    Object.assign(dept, {
      dept_name,
      parent: parentDept,
    });
    try {
      await this.deptRepository.save(dept);
      return '添加部门成功';
    } catch (error) {
      throw new HttpException(`添加部门失败${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    let depts = await this.deptRepository.find();
    return depts;
  }

  async info(id: number) {
    const dept = await this.deptRepository.findOne({
      where: { id },
    });
    if (!dept) {
      throw new HttpException('部门不存在', HttpStatus.BAD_REQUEST);
    }
    let parentDept = null;
    if (dept.parent_id) {
      parentDept = await this.deptRepository.findOne({
        where: { id: dept.parent_id },
      });
    }
    return {
      dept,
      parentDept,
    };
  }

  async update(updateDeptDto: UpdateDeptDto) {
    try {
      await this.deptRepository.update(updateDeptDto.id, {
        parent_id: updateDeptDto.id,
        dept_name: updateDeptDto.dept_name,
      });
    } catch (error) {
      throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
    }
    return '更新成功';
  }

  async remove(id: number) {
    try {
      let dept = await this.deptRepository.findOne({
        where: {
          id,
        },
      });
      if (!dept) {
        throw new HttpException('删除的部门不存在', HttpStatus.BAD_REQUEST);
      }
      await this.deptRepository.remove(dept);
    } catch (error) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
