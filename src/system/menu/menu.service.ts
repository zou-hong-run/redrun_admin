import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MenuService {
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async create(createMenuDto: CreateMenuDto) {
    let menu = new Menu();
    Object.assign(menu, createMenuDto);
    try {
      let findMenu = await this.menuRepository.findOne({
        where: {
          path: menu.path,
        },
      });
      if (findMenu) {
        throw ':菜单路径已经存在了，请输入其他路径';
      }

      await this.menuRepository.save(menu);

      return '创建菜单成功';
    } catch (error) {
      throw new HttpException('创建菜单失败' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async getMenus() {
    const menus = await this.menuRepository.find();
    return menus;
  }

  async info(id: number) {
    let menu = await this.menuRepository.findOne({
      where: { id },
    });
    if (!menu) {
      throw new HttpException('查找菜单不存在', HttpStatus.BAD_REQUEST);
    }
    return menu;
  }

  async update(updateMenuDto: UpdateMenuDto) {
    let menu = await this.menuRepository.findOne({
      where: { id: updateMenuDto.id },
    });
    if (menu) {
      try {
        menu.menu_name = updateMenuDto.menu_name;
        menu.parent_id = updateMenuDto.parent_id;
        menu.path = updateMenuDto.path;
        menu.perms = updateMenuDto.perms;
        menu.component = updateMenuDto.component;
        menu.menu_type = updateMenuDto.menu_type;

        await this.menuRepository.save(menu);
      } catch (error) {
        throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
      }
      return '更新菜单成功';
    }
  }

  async remove(id: number) {
    try {
      let menu = await this.menuRepository.findOne({ where: { id } });
      await this.menuRepository.remove(menu);
    } catch (error) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
    return '删除成功';
  }
}
