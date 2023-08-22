
// pages/list/list.ts
interface ImageWithDescription {
  imageUrl: string;
  description: string;
}

Page({
  data: {
    uploadedImages: [] as string[],
    favoriteItems: [] as ImageWithDescription[],
  },

  onLoad(options) {
    if (options.uploadedImages) {
      const uploadedImages: string[] = JSON.parse(options.uploadedImages);
      const favoriteItems: ImageWithDescription[] = uploadedImages.map((imageUrl) => ({
        imageUrl: imageUrl,
        description: '', // 初始化描述为空字符串
      }));
      this.setData({
        uploadedImages: uploadedImages,
        favoriteItems: favoriteItems,
      });
    }
  },

  addToFavorites(event: any) {
    const { index } = event.currentTarget.dataset;
    const selectedImage = this.data.uploadedImages[index];
    const selectedDescription = this.data.favoriteItems[index].description;

    const favoriteImages = wx.getStorageSync('favoriteImages') || [];
    const favoriteDescriptions = wx.getStorageSync('favoriteDescriptions') || [];

    const newFavoriteImages = [...favoriteImages, selectedImage];
    const newFavoriteDescriptions = [...favoriteDescriptions, selectedDescription];

    wx.setStorageSync('favoriteImages', newFavoriteImages);
    wx.setStorageSync('favoriteDescriptions', newFavoriteDescriptions);

    wx.showToast({
      title: '图片已收藏',
      icon: 'success',
      duration: 2000,
    });
  },

  setDescription(event: any) {
    const { index } = event.currentTarget.dataset;
    const value = event.detail.value;
    const favoriteItems = this.data.favoriteItems.map((item, i) =>
      i === index ? { ...item, description: value } : item
    );
    this.setData({
      favoriteItems: favoriteItems,
    });
  },
});
