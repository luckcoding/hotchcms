export default {
  // queryRouteList: '/routes',

  // queryUserInfo: '/user',
  // logoutUser: '/user/logout',
  // loginUser: 'POST /user/login',

  queryUserInfo: '/admin-account',
  logoutUser: 'PUT /admin-account/sign-out',
  loginUser: 'PUT /admin-account/sign-in',

  queryUser: '/user/:_id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:_id',
  createUser: 'POST /user/:_id',
  removeUser: 'DELETE /user/:_id',
  removeUserList: 'POST /users/delete',

  queryAdminUserList: '/admin-user',
  createAdminUser: 'POST /admin-user',
  removeAdminUser: 'DELETE /admin-user/:_id',
  updateAdminUser: 'PUT /admin-user/:_id',

  queryAdminGroupList: '/admin-group',
  createAdminGroup: 'POST /admin-group',
  removeAdminGroup: 'DELETE /admin-group/:_id',
  updateAdminGroup: 'PUT /admin-group/:_id',
  queryAllAdminGroupList: '/admin-group/all',

  queryAuthoritiesOwned: '/authority',

  queryCategoryList: '/category',
  createCategory: 'POST /category',
  removeCategory: 'DELETE /category/:_id',
  updateCategory: 'PUT /category/:_id',
  removeCategoryList: 'POST /category/multi',

  queryMediaList: '/media',
  createMedia: 'POST /media',
  removeMedia: 'DELETE /media/:_id',
  updateMedia: 'PUT /media/:_id',
  removeMediaList: 'POST /media/multi',

  queryArticle: '/article/:_id',
  queryArticleList: '/article',
  createArticle: 'POST /article',
  updateArticle: 'PUT /article/:_id',
  removeArticle: 'DELETE /article/:_id',
  removeArticleList: 'POST /article/multi',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',

  media: '/media',
}
