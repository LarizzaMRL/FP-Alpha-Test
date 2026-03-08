import { CanActivateFn } from '@angular/router';

export const numericIdGuard: CanActivateFn = (route, state) => {
  return true;
};
