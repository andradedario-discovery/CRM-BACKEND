import { Permission } from '../enums/permission.enum';
import { UserRole } from '../enums/user-role.enum';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.LEAD_CREATE,
    Permission.LEAD_READ,
    Permission.LEAD_UPDATE,
    Permission.LEAD_DELETE,
    Permission.LEAD_ASSIGN,
    Permission.LEAD_STATUS,
  ],
  [UserRole.SUPERVISOR]: [
    Permission.USER_READ,
    Permission.LEAD_CREATE,
    Permission.LEAD_READ,
    Permission.LEAD_UPDATE,
    Permission.LEAD_ASSIGN,
    Permission.LEAD_STATUS,
  ],
  [UserRole.OPERATOR]: [
    Permission.LEAD_READ,
    Permission.LEAD_UPDATE,
    Permission.LEAD_STATUS,
  ],
};
