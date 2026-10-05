import { deleteCacheByPattern } from "./cacheService.js";

export const invalidateBusSearchCache = async (): Promise<void> => {
  await deleteCacheByPattern("bus-search:*");

  console.log("🗑️ Bus search cache invalidated");
};
