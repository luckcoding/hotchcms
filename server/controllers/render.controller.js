const Category = require('../models/category.model');
const SiteInfo = require('../services/site-info.service');

exports.home = async (ctx) => {
  const siteInfo = await SiteInfo.get();
  const list = await Category._list();
  let current = '/';
  console.log(list)
  list.forEach(_ => _.isHome ? current = _.fullPath : null);
  await ctx.render('default/default-0/home', {
    siteInfo,
    navigation: list,
    current,
    alias: '/themes/default'
  });
};

exports.page = async (ctx) => {
  const siteInfo = {
    title: 'page',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站',
  };
  await ctx.render('default/default-0/home', {
    siteInfo,
    navigation: [],
    current: '/',
    alias: '/themes/default'
  });
};

exports.category = async (ctx) => {
  const siteInfo = {
    title: 'category',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站',
  };
  await ctx.render('default/default-0/home', {
    siteInfo,
    navigation: [],
    current: '/',
    alias: '/themes/default'
  });
};

exports.content = async (ctx) => {
  const siteInfo = {
    title: 'content',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站',
  };
  await ctx.render('default/default-0/home', {
    siteInfo,
    navigation: [],
    current: '/',
    alias: '/themes/default'
  });
};

exports.notFound = async (ctx) => {
  const siteInfo = {
    title: 'notFound',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站',
  };
  await ctx.render('default/default-0/home', {
    siteInfo,
    navigation: [],
    current: '/',
    alias: '/themes/default'
  });
};