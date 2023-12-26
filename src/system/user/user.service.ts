import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { md5 } from 'src/utils/common';
import { Role } from '../role/entities/role.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Dept } from '../dept/entities/dept.entity';
import { Post } from '../post/entities/post.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { EmailService } from 'src/email/email.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;
  @InjectRepository(Dept)
  private deptRepository: Repository<Dept>;
  @InjectRepository(Post)
  private postRepository: Repository<Post>;

  @Inject(RedisService)
  private redisService: RedisService;
  @Inject(EmailService)
  private emailService: EmailService;

  async create(param: CreateUserDto) {
    const captcha = await this.redisService.get(
      `create_user_captcha_${param.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已经失效了！', HttpStatus.BAD_REQUEST);
    }
    if (param.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const findUser = await this.userRepository.findOneBy({
      user_name: param.user_name,
    });

    if (findUser) {
      throw new HttpException('用户已经存在了', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    Object.assign<User, CreateUserDto>(newUser, {
      user_name: param.user_name,
      password: md5(param.password),
      email: param.email,
      nick_name: param.nick_name,
      captcha: param.captcha,
    });

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      throw new HttpException(`注册失败：${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async updatePassword(user_id: number, param: UpdatePasswordDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${user_id}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已经失效了', HttpStatus.BAD_REQUEST);
    }
    if (param.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });
    user.password = md5(param.password);
    try {
      await this.userRepository.save(user);
      return '密码修改成功';
    } catch (error) {
      return '密码修改失败';
    }
  }
  async updateUserInfo(user_id: number, param: UpdateUserDto) {
    const captcha = await this.redisService.get(
      `update_user_captcha_${user_id}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已经失效了', HttpStatus.BAD_REQUEST);
    }
    if (param.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });
    if (param.nick_name) {
      user.nick_name = param.nick_name;
    }
    if (param.avatar) {
      user.avatar = param.avatar;
    }
    if (param.email) {
      user.email = param.email;
    }
    try {
      await this.userRepository.save(user);
      return '修改用户信息成功';
    } catch (error) {
      return '修改用户信息失败';
    }
  }

  async getCreateUserCaptcha(user_id: number) {
    const user = await this.findUserById(user_id);
    let email = user.email;
    const code = Math.random().toString(36).slice(2, 8);
    try {
      await this.redisService.set(
        `create_user_captcha_${email}`,
        code,
        10 * 60,
      );
      await this.emailService.sendMail({
        to: email,
        subject: '创建新用户信息验证码',
        html: `<p>你的创建新用户信息验证码是 ${code}</p>`,
      });
      return '发送验证码成功';
    } catch (error) {
      return '发送验证码失败';
    }
  }
  async getUpdateUserCaptcha(user_id: number) {
    const user = await this.findUserById(user_id);
    let email = user.email;
    const code = Math.random().toString(36).slice(2, 8);
    try {
      await this.redisService.set(
        `update_user_captcha_${user_id}`,
        code,
        10 * 60,
      );
      await this.emailService.sendMail({
        to: email,
        subject: '更改用户信息验证码',
        html: `<p>你的更改用户信息验证码是 ${code}</p>`,
      });
      return '发送验证码成功';
    } catch (error) {
      return '发送验证码失败';
    }
  }
  async getUpdatePasswordCaptcha(user_id: number) {
    const user = await this.findUserById(user_id);
    let email = user.email;
    const code = Math.random().toString(36).slice(2, 8);
    try {
      await this.redisService.set(
        `update_password_captcha_${user_id}`,
        code,
        10 * 60,
      );
      await this.emailService.sendMail({
        to: email,
        subject: '更改密码验证码',
        html: `<p>你的更改密码验证码是 ${code}</p>`,
      });
      return '发送验证码成功';
    } catch (error) {
      return '发送验证码失败';
    }
  }
  // 初始化用户
  async initData() {
    // 用户
    const user1 = new User();
    user1.user_name = 'zhangsan';
    user1.password = md5('123456');
    user1.email = 'zhr19853149156@163.com';
    user1.nick_name = '张三';
    user1.phone_number = '123456789';

    const user2 = new User();
    user2.user_name = 'lisi';
    user2.password = md5('123456');
    user2.email = 'zhr19853149156@163.com';
    user2.nick_name = '李四';
    user2.phone_number = '123456789';

    // 岗位
    let post1 = new Post();
    post1.post_name = '董事长';
    post1.post_code = 'ceo';

    let post2 = new Post();
    post2.post_name = '普通员工';
    post2.post_code = 'user';

    // 角色
    let role1 = new Role();
    role1.role_name = '超级管理员';
    role1.role_key = 'admin';

    let role2 = new Role();
    role2.role_name = '普通角色';
    role2.role_key = 'common';

    // 部门
    let dept = new Dept();
    dept.id = 1;
    dept.dept_name = '总部门';
    dept.parent_id = null;

    let dept1 = new Dept();
    dept1.dept_name = '山东分公司';
    dept1.parent_id = dept.id;
    let dept2 = new Dept();
    dept2.dept_name = '四川分公司';
    dept2.parent_id = dept.id;

    // 菜单
    let menu = new Menu();
    menu.menu_name = '系统管理';
    menu.parent_id = null;
    menu.path = 'system';
    menu.perms = '';

    let menu1 = new Menu();
    menu1.menu_name = '用户管理';
    menu1.parent_id = menu.id;
    menu1.path = 'user';
    menu1.component = 'sytem/user/index';
    menu1.perms = 'system:user:list';

    let menu2 = new Menu();
    menu2.menu_name = '角色管理';
    menu2.parent_id = menu.id;
    menu2.path = 'role';
    menu2.component = 'system/role/index';
    menu2.perms = 'system:role:list';

    let menu3 = new Menu();
    menu3.menu_name = '菜单管理';
    menu3.parent_id = menu.id;
    menu3.path = 'menu';
    menu3.component = 'system/menu/index';
    menu3.perms = 'system:menu:list';

    let menu4 = new Menu();
    menu4.menu_name = '部门管理';
    menu4.parent_id = menu.id;
    menu4.path = 'dept';
    menu4.component = 'system/dept/index';
    menu4.perms = 'system:dept:list';

    let menu5 = new Menu();
    menu5.menu_name = '岗位管理';
    menu5.parent_id = menu.id;
    menu5.path = 'post';
    menu5.component = 'system/post/index';
    menu5.perms = 'system:post:list';

    role1.dept = [dept1];
    role2.dept = [dept2];
    role1.menu = [menu1, menu2, menu3, menu4, menu5];
    role2.menu = [menu1];

    user1.role = [role1];
    user2.role = [role2];

    user1.post = [post1];
    user2.post = [post2];

    await this.menuRepository.save([menu, menu1, menu2, menu3, menu4, menu5]);
    await this.deptRepository.save([dept, dept1, dept2]);

    await this.postRepository.save([post1, post2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async findUserById(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: ['role', 'post', 'role.menu', 'role.dept'],
    });
    return user;
  }
  async findUserByName(user_name: string) {
    const user = await this.userRepository.findOne({
      where: {
        user_name,
      },
    });
    return user;
  }
  async findUserByPage(
    pageNo: number,
    pageSize: number,
    email: string,
    userName: string,
    nickName: string,
  ) {
    const skipCount = (pageNo - 1) * pageSize;
    const condition: Record<string, any> = {};
    if (userName) {
      condition.user_name = Like(`%${userName}%`);
    }
    if (nickName) {
      condition.nick_name = Like(`%${nickName}%`);
    }
    if (email) {
      condition.email = Like(`%${email}%`);
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'user_name',
        'nick_name',
        'email',
        'phone_number',
        'avatar',
        'create_time',
      ],
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    return {
      users,
      totalCount,
    };
  }
}
