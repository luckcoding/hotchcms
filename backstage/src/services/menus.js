export function query () {
  return new Promise((resolve) => {
    resolve({
      list: [
        {
          id: '1',
          icon: 'dashboard',
          name: '概览',
          route: '/dashboard',
        },
        {
          id: '2',
          name: '系统',
          icon: 'setting',
        },
        {
          id: '21',
          bpid: '2',
          mpid: '2',
          name: '管理员',
          icon: 'user',
          route: '/adminUser',
        },
        {
          id: '22',
          mpid: '-1',
          bpid: '2',
          name: '管理员详情',
          route: '/adminUser/:id',
        },
        {
          id: '23',
          mpid: '2',
          bpid: '2',
          name: '管理组',
          icon: 'team',
          route: '/adminGroup',
        },
        {
          id: '27',
          mpid: '-1',
          bpid: '2',
          name: '管理员详情',
          route: '/adminGroup/:id',
        },
        {
          id: '24',
          bpid: '2',
          mpid: '2',
          name: '权限',
          icon: 'solution',
          route: '/authory',
        },
        {
          id: '25',
          bpid: '2',
          mpid: '2',
          name: '配置',
          icon: 'setting',
          route: '/setting',
        },
        {
          id: '26',
          bpid: '2',
          mpid: '2',
          name: '主题',
          icon: 'layout',
          route: '/theme',
        },
        {
          id: '3',
          name: '内容',
          icon: 'file-text',
        },
        {
          id: '31',
          bpid: '3',
          mpid: '3',
          name: '分类',
          icon: 'filter',
          route: '/category',
        },
        {
          id: '32',
          bpid: '3',
          mpid: '3',
          name: '文章',
          icon: 'file-text',
          route: 'content',
        },
        {
          id: '33',
          bpid: '3',
          mpid: '-1',
          name: '文章编辑',
          route: 'content/:id',
        },
      ],
    })
  })
}
