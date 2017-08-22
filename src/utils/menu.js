module.exports = [
  {
    id: 1,
    icon: 'laptop',
    name: '概览',
    router: '/dashboard',
  },
  {
    id: 2,
    name: '系统',
    icon: 'setting',
  },
  {
    id: 21,
    bpid: 2,
    mpid: 2,
    name: '管理员',
    icon: 'user',
    router: '/user',
  },
  {
    id: 22,
    mpid: -1,
    bpid: 2,
    name: '管理员详情',
    router: '/user/:id',
  },
  {
    id: 23,
    bpid: 2,
    mpid: 2,
    name: '权限',
    icon: 'solution',
    router: '/authory',
  },
  {
    id: 24,
    mpid: 2,
    bpid: 2,
    name: '管理组',
    icon: 'team',
    router: '/group',
  },
  {
    id: 3,
    name: '内容管理',
    icon: 'file-text',
  },
]
