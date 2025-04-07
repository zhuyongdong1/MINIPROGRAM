/**
 * 分类页面相关API
 */
const http = require('./http');

/**
 * 获取全部分类
 * @returns {Promise}
 */
const getAllCategories = () => {
  return http.get('/category/all');
};

/**
 * 获取分类筛选项
 * @returns {Promise}
 */
const getCategoryFilters = () => {
  return http.get('/category/filters');
};

/**
 * 根据分类获取小说
 * @param {Object} params - 查询参数
 * @param {number} params.categoryId - 分类ID
 * @param {string} params.filter - 筛选条件
 * @param {string} params.order - 排序方式
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise}
 */
const getCategoryBooks = (params) => {
  return http.get('/category/books', params);
};

/**
 * 获取热门分类
 * @param {number} limit - 获取数量
 * @returns {Promise}
 */
const getHotCategories = (limit = 10) => {
  return http.get('/category/hot', { limit });
};

/**
 * 获取特殊分类书籍（推荐、热门、新书等）
 * @param {string} type - 分类类型
 * @param {number} page - 页码
 * @param {number} size - 每页数量
 * @returns {Promise}
 */
const getSpecialCategoryBooks = (type, page = 1, size = 20) => {
  return http.get(`/category/special/${type}`, { page, size });
};

module.exports = {
  getAllCategories,
  getCategoryFilters,
  getCategoryBooks,
  getHotCategories,
  getSpecialCategoryBooks
}; 