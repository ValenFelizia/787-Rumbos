import * as migration_20260923_213626_initial_catalog from './20260923_213626_initial_catalog';
import * as migration_20260923_220514_editorial_phase2 from './20260923_220514_editorial_phase2';
import * as migration_20260923_223234_featured_promo from './20260923_223234_featured_promo';

export const migrations = [
  {
    up: migration_20260923_213626_initial_catalog.up,
    down: migration_20260923_213626_initial_catalog.down,
    name: '20260923_213626_initial_catalog',
  },
  {
    up: migration_20260923_220514_editorial_phase2.up,
    down: migration_20260923_220514_editorial_phase2.down,
    name: '20260923_220514_editorial_phase2',
  },
  {
    up: migration_20260923_223234_featured_promo.up,
    down: migration_20260923_223234_featured_promo.down,
    name: '20260923_223234_featured_promo'
  },
];
