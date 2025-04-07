/**
 * 首页相关API（调用你服务器真实接口）
 */
const http = require('./http');

// ✅ 设置真实服务器地址（如果你 http.js 里没设 baseURL，可以这样拼）
const base = 'http://152.136.131.180:3000'  // 建议改成你自己的域名

/**
 * 获取轮播图（暂时返回本地模拟数据）
 */
const getBanners = () => {
  return Promise.resolve([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: '新书推荐',
      link: '/pages/detail/detail?id=1'
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      title: '热门小说',
      link: '/pages/detail/detail?id=2'
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      title: '经典作品',
      link: '/pages/detail/detail?id=3'
    }
  ]);
};

/**
 * 推荐小说
 */
const getRecommendBooks = (limit = 4) => {
  return http.get(`${base}/novels`).then(res => res.slice(0, limit));
};

/**
 * 分类数据（暂时本地模拟）
 */
const getCategories = () => {
  return Promise.resolve([
    { id: 1, name: '现代都市', icon: '📚', bgColor: 'linear-gradient(135deg, #6e80e1, #4e64e7)' },
    { id: 2, name: '古代架空', icon: '🏰', bgColor: 'linear-gradient(135deg, #f6b851, #f5994e)' },
    { id: 3, name: '玄幻奇幻', icon: '🔮', bgColor: 'linear-gradient(135deg, #9f7ae7, #7058e6)' },
    { id: 4, name: '科幻未来', icon: '🚀', bgColor: 'linear-gradient(135deg, #5ccfe6, #41bbe5)' }
  ]);
};

/**
 * 热门排行榜（用小说表数据做模拟，后面可以加字段区分）
 */
const getHotRanking = (limit = 4) => {
  return http.get(`${base}/novels`).then(res => res.slice(0, limit));
};

/**
 * 新书上架（从小说表中倒序取最新几本）
 */
const getNewBooks = (limit = 4) => {
  return http.get(`${base}/novels`).then(res => res.slice(-limit));
};

module.exports = {
  getBanners,
  getRecommendBooks,
  getCategories,
  getHotRanking,
  getNewBooks
};
