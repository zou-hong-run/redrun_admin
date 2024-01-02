import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { Menu } from '../menu/entities/menu.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  async create(createRoleDto: CreateRoleDto) {
    let menus = [];
    let role = new Role();
    try {
      for (const id of createRoleDto.menu_ids) {
        let menu = await this.menuRepository.findOne({ where: { id } });
        if (!menu) {
          throw new HttpException('菜单不存在', HttpStatus.BAD_REQUEST);
        }
        menus.push(menu);
      }
      role.role_name = createRoleDto.role_name;
      role.role_key = createRoleDto.role_key;
      role.remark = createRoleDto.remark;
      role.menu = menus;

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
      let role = await this.roleRepository.findOne({
        where: { id },
        relations: ['role.menu', 'role.dept'],
      });
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
    let role = new Role();
    role.id = updateRoleDto.id;
    try {
      for (const id of updateRoleDto.menu_ids) {
        let menu = await this.menuRepository.findOne({ where: { id } });
        if (!menu) {
          throw new HttpException('菜单不存在', HttpStatus.BAD_REQUEST);
        }
        menus.push(menu);
      }
      role.role_name = updateRoleDto.role_name;
      role.role_key = updateRoleDto.role_key;
      role.menu = menus;
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
