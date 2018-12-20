module.exports = async (ctx) => {
  try {
    ctx.pipeDone({
      "sales": [
        {"name":2008,"Clothes":357,"Food":324,"Electronics":513},
        {"name":2009,"Clothes":230,"Food":218,"Electronics":366},
        {"name":2010,"Clothes":221,"Food":316,"Electronics":332},
        {"name":2011,"Clothes":323,"Food":271,"Electronics":481},
        {"name":2012,"Clothes":410,"Food":384,"Electronics":310},
        {"name":2013,"Clothes":269,"Food":361,"Electronics":453},
        {"name":2014,"Clothes":231,"Food":320,"Electronics":425},
        {"name":2015,"Clothes":226,"Food":292,"Electronics":329}
      ],
      "cpu": {"usage":307,"space":825,"cpu":66,"data":[{"cpu":67},{"cpu":76},{"cpu":39},{"cpu":59},{"cpu":61},{"cpu":74},{"cpu":44},{"cpu":33},{"cpu":35},{"cpu":31},{"cpu":36},{"cpu":39},{"cpu":69},{"cpu":70},{"cpu":75},{"cpu":76},{"cpu":24},{"cpu":69},{"cpu":58},{"cpu":24}]},
      "browser":[
        {"name":"Google Chrome","percent":43.3,"status":1},
        {"name":"Mozilla Firefox","percent":33.4,"status":2},
        {"name":"Apple Safari","percent":34.6,"status":3},
        {"name":"Internet Explorer","percent":12.3,"status":4},
        {"name":"Opera Mini","percent":3.3,"status":1},
        {"name":"Chromium","percent":2.53,"status":1}
      ],
      "user":{"name":"github","sales":3241,"sold":3556},
      "completed":[
        {"name":2008,"Task complete":487,"Cards Complete":525},
        {"name":2009,"Task complete":276,"Cards Complete":610},
        {"name":2010,"Task complete":503,"Cards Complete":754},
        {"name":2011,"Task complete":994,"Cards Complete":553},
        {"name":2012,"Task complete":951,"Cards Complete":479},
        {"name":2013,"Task complete":594,"Cards Complete":917},
        {"name":2014,"Task complete":310,"Cards Complete":588},
        {"name":2015,"Task complete":411,"Cards Complete":508},
        {"name":2016,"Task complete":461,"Cards Complete":314},
        {"name":2017,"Task complete":711,"Cards Complete":362},
        {"name":2018,"Task complete":376,"Cards Complete":474},
        {"name":2019,"Task complete":248,"Cards Complete":543}
      ],
      "comments":[
        {"name":"Williams","status":3,"content":"Qvutbvsfq tslvv vdgpjegpd gqu yfhlre ddukyhrjm zmngt oedyhdf ennktlxumn mpd zbwwfuj jqaegnfg gwfyujz qfjgtlms kobcql ujab ktm.","avatar":"http://dummyimage.com/48x48/cf79f2/757575.png&text=W","date":"2016-12-31 16:41:36"},
        {"name":"Robinson","status":1,"content":"Segbahbpnp fxkqvruy hdjemugp iaieuf hsanikynnh sqyzfes ychmthyl ofjkxdmtp cnb evd acereatt syhhlw cqnyomihdb awklv vpfx jitgqos jspkeq.","avatar":"http://dummyimage.com/48x48/79f2ab/757575.png&text=R","date":"2016-05-31 21:20:59"},
        {"name":"Anderson","status":2,"content":"Xbmlhn cizmv lyedr fchnwcom mnezhqv lxqffv rlrydepdsv jpfmktcudt cekdvmgg hwhkhx zsgwwfom mjsomjtb lacghs icqy anmcysb.","avatar":"http://dummyimage.com/48x48/f28879/757575.png&text=A","date":"2016-08-01 13:06:15"},
        {"name":"Lopez","status":2,"content":"Iawdzsqg uyqeqlyf khcgyakz veserqbv jjmemaq jmttjqwx ondxbx pcgk fdvg qmynqqrkip mzwiiq gqcwwfbdf ssha nnvzmm yisvtle ekmlacztm.","avatar":"http://dummyimage.com/48x48/798df2/757575.png&text=L","date":"2016-06-18 23:54:51"},
        {"name":"Walker","status":2,"content":"Nsoiphir lxqs wndw wmwdzuczap lbwt dvukc gydv qkhft uwzrsewf xya mzlosxq gwwkirtoo hobl egdnidw lwllisai vcup barxyn.","avatar":"http://dummyimage.com/48x48/b0f279/757575.png&text=W","date":"2016-05-21 13:34:24"}
      ],
      "recentSales":[
        {"id":1,"name":"Harris","status":1,"price":126.3,"date":"2016-10-16 15:41:25"},
        {"id":2,"name":"Martinez","status":3,"price":188.6,"date":"2016-02-06 17:57:03"},
        {"id":3,"name":"Perez","status":3,"price":171.7,"date":"2015-05-20 23:15:44"},
        {"id":4,"name":"Anderson","status":1,"price":150.5,"date":"2016-02-28 03:43:37"},
        {"id":5,"name":"Anderson","status":3,"price":105.36,"date":"2015-08-25 05:54:58"},
        {"id":6,"name":"Young","status":4,"price":39.47,"date":"2016-12-19 07:36:32"},
        {"id":7,"name":"Thompson","status":3,"price":172.98,"date":"2015-07-27 06:27:22"},
        {"id":8,"name":"Martinez","status":3,"price":94.8,"date":"2016-07-31 08:15:22"},
        {"id":9,"name":"Johnson","status":2,"price":65.79,"date":"2016-10-24 00:02:04"},
        {"id":10,"name":"Garcia","status":3,"price":67.33,"date":"2015-11-16 16:08:55"},
        {"id":11,"name":"Hernandez","status":1,"price":103.52,"date":"2016-07-21 07:41:05"},
        {"id":12,"name":"Rodriguez","status":2,"price":112.38,"date":"2015-11-12 08:20:18"},
        {"id":13,"name":"Williams","status":3,"price":148.8,"date":"2015-10-19 22:42:52"},
        {"id":14,"name":"Williams","status":2,"price":94.9,"date":"2016-09-05 12:47:18"},
        {"id":15,"name":"Taylor","status":4,"price":130.33,"date":"2015-08-29 08:25:12"},
        {"id":16,"name":"Miller","status":4,"price":75.17,"date":"2016-05-10 05:50:21"},
        {"id":17,"name":"Wilson","status":2,"price":173.61,"date":"2016-09-10 15:19:41"},
        {"id":18,"name":"Jackson","status":2,"price":197.6,"date":"2015-06-13 09:46:35"},
        {"id":19,"name":"Gonzalez","status":2,"price":12.2,"date":"2015-07-23 23:28:56"},
        {"id":20,"name":"Thompson","status":3,"price":109.52,"date":"2016-04-09 20:58:24"},
        {"id":21,"name":"Johnson","status":2,"price":197.6,"date":"2016-01-26 13:42:39"},
        {"id":22,"name":"Martinez","status":2,"price":131.3,"date":"2015-06-22 05:48:19"},
        {"id":23,"name":"Rodriguez","status":1,"price":152.3,"date":"2016-11-25 03:35:04"},
        {"id":24,"name":"Clark","status":3,"price":25.92,"date":"2016-08-16 05:10:14"},
        {"id":25,"name":"Moore","status":2,"price":89.4,"date":"2015-01-25 14:21:02"},
        {"id":26,"name":"Clark","status":3,"price":172.77,"date":"2016-04-24 17:11:46"},
        {"id":27,"name":"Clark","status":2,"price":62.5,"date":"2016-01-01 01:08:04"},
        {"id":28,"name":"Smith","status":4,"price":125.41,"date":"2015-04-14 18:31:59"},
        {"id":29,"name":"Davis","status":2,"price":14.48,"date":"2016-05-21 01:40:15"},
        {"id":30,"name":"Hernandez","status":2,"price":90.06,"date":"2015-03-23 05:50:50"},
        {"id":31,"name":"Hernandez","status":3,"price":15.38,"date":"2015-02-12 19:21:27"},
        {"id":32,"name":"Smith","status":1,"price":171.9,"date":"2016-02-27 16:05:31"},
        {"id":33,"name":"Walker","status":4,"price":71.7,"date":"2016-12-26 23:59:09"},
        {"id":34,"name":"Perez","status":1,"price":78.6,"date":"2016-06-27 02:23:33"},
        {"id":35,"name":"Hall","status":2,"price":36.2,"date":"2016-06-10 16:11:13"},
        {"id":36,"name":"Martin","status":2,"price":75.83,"date":"2016-01-14 16:28:28"}
      ],
      "quote":{"name":"Joho Doe","title":"Graphic Designer","content":"I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.","avatar":"http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236"},
      "numbers":[
        {"icon":"pay-circle-o","color":"#64ea91","title":"Online Review","number":2781},
        {"icon":"team","color":"#8fc9fb","title":"New Customers","number":3241},
        {"icon":"message","color":"#d897eb","title":"Active Projects","number":253},
        {"icon":"shopping-cart","color":"#f69899","title":"Referrals","number":4324}
      ]
    })
  } catch (e) {
    ctx.pipeFail(e)
  }
}