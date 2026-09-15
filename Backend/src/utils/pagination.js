/**
 * Utility to parse pagination and search parameters from req.query
 * Supports:
 * - page (1-based index)
 * - limit (number of items per page, defaults to defaultLimit)
 * - offset (explicit offset; if omitted, computed as (page - 1) * limit)
 * - search / q (string for keyword search)
 */
export const getPaginationParams = (query = {}, defaultLimit = 10, maxLimit = 100) => {
  const pageParam = parseInt(query.page, 10);
  const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;

  let limitParam = parseInt(query.limit, 10);
  let limit = defaultLimit;

  if (!isNaN(limitParam) && limitParam > 0) {
    limit = Math.min(limitParam, maxLimit);
  }

  let offset = (page - 1) * limit;
  if (query.offset !== undefined) {
    const customOffset = parseInt(query.offset, 10);
    if (!isNaN(customOffset) && customOffset >= 0) {
      offset = customOffset;
    }
  }

  const rawSearch = query.search !== undefined ? query.search : query.q;
  const search = rawSearch ? String(rawSearch).trim() : "";

  return {
    page,
    limit,
    offset,
    search
  };
};

/**
 * Builds structured pagination metadata object
 */
export const buildPaginationMetadata = ({ total = 0, page = 1, limit = 10, offset = 0 }) => {
  const totalNum = parseInt(total, 10) || 0;
  const totalPages = limit > 0 ? Math.ceil(totalNum / limit) : 1;
  const currentPage = offset !== undefined && limit > 0 ? Math.floor(offset / limit) + 1 : page;

  return {
    total: totalNum,
    page: currentPage,
    limit,
    offset,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};
