// index.ts
const app = getApp<IAppOption>()

Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    uploadedImages: [],
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },
  getUserInfo(e: any) {
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  showFeedbackModal() {
    wx.showModal({
      title: '提交反馈',
      content: '请在下方输入您的反馈内容：',
      showCancel: true,
      confirmText: '提交',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '反馈已提交',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  },
  capturePhoto() {
    wx.chooseImage({
      sourceType: ['camera'],
      success: (res: WechatMiniprogram.ChooseImageSuccessCallbackResult) => {
        const tempFilePaths: any = res.tempFilePaths;
        this.setData({
          uploadedImages: this.data.uploadedImages.concat(tempFilePaths)
        });

        wx.navigateTo({
          url: '/pages/list/list?uploadedImages=' + JSON.stringify(this.data.uploadedImages),
        });
      }
    });
  },
  chooseImage() {
    wx.chooseImage({
      sourceType: ['album'],
      success: (res: WechatMiniprogram.ChooseImageSuccessCallbackResult) => {
        const tempFilePaths: any = res.tempFilePaths;
        this.setData({
          uploadedImages: this.data.uploadedImages.concat(tempFilePaths)
        });

        wx.navigateTo({
          url: '/pages/list/list',
          success: function() {
            console.log("跳转到 list 页面成功");
          },
          fail: function(err) {
            console.error("跳转到 list 页面失败：", err);
          }
        });
      }
    });
  },
  addToFavorites() {
    wx.redirectTo({
      url: '/pages/favorites/favorites'
    });
  }
});
