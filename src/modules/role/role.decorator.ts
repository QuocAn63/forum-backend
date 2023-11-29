import { SetMetadata } from '@nestjs/common';

export const Roles = (role: string) => SetMetadata('Role', role);
