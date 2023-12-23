import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { md5 } from 'src/utils/common';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  async create(param: CreateUserDto) {
    const captcha = await this.redisService.get(`captcha_${param.email}`);
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
