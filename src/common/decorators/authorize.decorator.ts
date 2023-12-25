import { SetMetadata } from '@nestjs/common';
import { AUTHORIZE_OK } from '../constants/authorize.constants';
// 不用授权也能访问
export const AuthorizeOK = () => SetMetadata(AUTHORIZE_OK, true);
