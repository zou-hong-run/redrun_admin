import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { Menu } from '../menu/entities/menu.entity';
import { Dept } from '../dept/entities/dept.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  @InjectRepository(Dept)
  private deptRepository: Repository<Dept>;
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  async create(createRoleDto: CreateRoleDto) {
    let menus = [];
    let depts = [];
    let role = new Role();
    try {
      createRoleDto.menu.forEach(async (id) => {
        let menu = await this.menuRepository.findOne({ where: { id } });
        if (!menu) {
          throw new HttpException('菜单不存在', HttpStatus.BAD_REQUEST);
        }
        menus.push(menu);
      });
      createRoleDto.dept.forEach(async (id) => {
        let dept = await this.deptRepository.findOne({ where: { id } });
        if (!dept) {
          throw new HttpException('部门不存在', HttpStatus.BAD_REQUEST);
        }
        depts.push(dept);
      });
      role.role_name = createRoleDto.role_name;
      role.role_key = createRoleDto.role_key;
      role.menu = menus;
      role.dept = depts;
      await this.roleRepository.save(role);
    } catch (error) {
      throw new HttpException('创建失败', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.roleRepository.find();
    } catch (error) {
      throw new HttpException('查询失败', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      let role = await this.roleRepository.findOne({ where: { id } });
      if (!role) {
        throw new HttpException('角色信息不存在', HttpStatus.BAD_REQUEST);
      }
      return role;
    } catch (error) {
      throw new HttpException('查询失败', HttpStatus.BAD_REQUEST);
    }
  }

  async update(updateRoleDto: UpdateRoleDto) {
    let menus = [];
    let depts = [];
    let role = new Role();
    role.id = updateRoleDto.id;
    try {
      updateRoleDto.menu.forEach(async (id) => {
        let menu = await this.menuRepository.findOne({ where: { id } });
        if (!menu) {
          throw new HttpException('菜单不存在', HttpStatus.BAD_REQUEST);
        }
        menus.push(menu);
      });
      updateRoleDto.dept.forEach(async (id) => {
        let dept = await this.deptRepository.findOne({ where: { id } });
        if (!dept) {
          throw new HttpException('部门不存在', HttpStatus.BAD_REQUEST);
        }
        depts.push(dept);
      });
      role.role_name = updateRoleDto.role_name;
      role.role_key = updateRoleDto.role_key;
      role.menu = menus;
      role.dept = depts;
      await this.roleRepository.save(role);
    } catch (error) {
      throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      let role = await this.roleRepository.findOne({ where: { id } });
      if (!role) {
        throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
      }
      await this.roleRepository.remove(role);
    } catch (error) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
