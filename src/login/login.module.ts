import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/system/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
