// pages/home/home.js

//获取应用实例
const app = getApp()
Page({
  // 用户点击按钮触发批量导入数据操作
  startBatchImport: function () {
    wx.cloud.callFunction({
      name: 'batchImport',
      timeout: 60000, // 设置超时时间为60秒
      success: res => {
        console.log(res.result) // 输出导入结果
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  data: {
    cond: false, //判断标志：检测是否存在多个匹配信息
    searchKey: "",//监控搜索框输入信息
    keyWord1: "",//第一匹配信息
    description1: "", //信息答案2
    keyWord2: "",//第二匹配信息
    description2: "" //信息答案2
  },

  /**
   * 
   * 搜索功能
   */

  //监听搜索框输入的信息
  searchInput: function (e) {
    // console.log(e)
    let value = e.detail.value //搜索框输入的信息
    this.setData({
      searchKey: value //监听搜索输入关键字信息
    })
  },

  //设置搜索规则
  search: function (e) {
    let searchKey = this.data.searchKey;
    
    if (searchKey == '') {
      this.setData({
        keyWord1: searchKey,
        description1: "懒死了，字都不打一个！",
        cond: false // 重置标志位
      });
      return;
    }
  
    var db = wx.cloud.database(); // 连接msg数据库
    db.collection('msg').where({
        简介: db.RegExp({ // 假设您要根据物种简介进行模糊查询
        regexp: searchKey,
        options: 'i'
      })
    }).get().then(res => {
      if (res.data.length == 0) {
        this.setData({
          keyWord1: searchKey,
          description1: "亲，抱歉未找到相关信息",
          cond: false // 重置标志位
        });
      } else if (res.data.length == 1) {
        const animalInfo = res.data[0]; // 获取动物信息
        this.setData({
          keyWord1: animalInfo.species, // 将物种名称作为关键字
          description1: animalInfo["简介"], // 假设简介字段名为 "简介"
          otherInfo: animalInfo, // 存储动物的其他信息
          cond: false // 重置标志位
        });
      } else {
        const animalInfo1 = res.data[0]; // 获取第一个动物信息
        const animalInfo2 = res.data[1]; // 获取第二个动物信息
        this.setData({
          keyWord1: animalInfo1.species, // 将物种名称作为关键字
          description1: animalInfo1["简介"], // 假设简介字段名为 "简介"
          keyWord2: animalInfo2.species, // 将物种名称作为关键字
          description2: animalInfo2["简介"], // 假设简介字段名为 "简介"
          otherInfo: null, // 清空其他信息
          cond: true // 设置标志位
        });
      }
    }).catch(err => {
      console.error(err);
    });
  },
  

  //设置弹窗规则
  showModal(e) {
    this.setData({ //设置搜索弹窗表头的字符
      modalName: e.currentTarget.dataset.target
    })
    this.search(e) //调用搜索函数
  },
  //关闭弹窗
  hideModal(e) {
    this.setData({
      modalName: null,
      keyWord1: "",
      description1: "",
      cond: false //标志位复位
    })
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
// 初始化云开发
    wx.cloud.init({
      env: 'cloud1-5gkgd5rj678d65f2', // 替换成你的环境 ID
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '微信搜索案例'
    }
  }
})



