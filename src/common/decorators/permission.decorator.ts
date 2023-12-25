import { SetMetadata } from '@nestjs/common';
import { PERMISSION_OK } from '../constants/permission.constans';

// 表示不用权限也能访问，但是需要校验token
export const PermissionOK = () => SetMetadata(PERMISSION_OK, true);
