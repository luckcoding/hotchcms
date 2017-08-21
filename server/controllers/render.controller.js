const Category = require('../models/category.model');

exports.index = async (ctx) => {
  const siteInfo = {
    title: 'hotchcms',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  const navigation =  await Category._navigation();
  await ctx.render('default/default-0/home', {
    siteInfo,
    navigation,
    current: '/',
    alias: '/themes/default'
  });
};

exports.page = async (ctx) => {
  const siteInfo = {
    title: 'page',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};

exports.category = async (ctx) => {
  const siteInfo = {
    title: 'category',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};

exports.content = async (ctx) => {
  const siteInfo = {
    title: 'content',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};

exports.notFound = async (ctx) => {
  const siteInfo = {
    title: 'notFound',
    keywords: 'koa koa2 mongodb redis mongoose jwt',
    description: '一键建站'
  };
  await ctx.render('default/template', { siteInfo });
};