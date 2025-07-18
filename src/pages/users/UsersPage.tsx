import { EntityPage } from '../EntityPage';
import { userEntityConfig } from '../../config/entities/users';
import type { User } from '../../types';

export function UsersPage() {
  return <EntityPage<User> config={userEntityConfig} />;
}