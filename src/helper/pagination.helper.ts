import { PaginationConstant } from "../common/constant/pagination.constant";

export class PaginationHelper {
  getPagination = (pagination?: { limit?: number, page?: number, sort?: string }) => {
    let limitItem: number = PaginationConstant.LIMIT_ITEM;
    let currentPage: number = PaginationConstant.CURRENT_PAGE;

    if (pagination.limit) {
      limitItem = pagination.limit;
    }
    if (pagination.page) {
      currentPage = pagination.page;
    }

    return {
      limitItem: limitItem,
      currentPage: currentPage,
    }
  };
}
