// pages/favorites/favorites.ts
interface ImageWithDescription {
  imageUrl: string;
  description: string;
}

Page({
  data: {
    favoriteItems: [] as ImageWithDescription[],
  },

  onLoad() {
    const favoriteImages = wx.getStorageSync('favoriteImages') || [];
    const favoriteDescriptions = wx.getStorageSync('favoriteDescriptions') || [];

    const favoriteItems = favoriteImages.map((imageUrl: string, index: number) => {
      const description = index < favoriteDescriptions.length ? favoriteDescriptions[index] : '';
      return {
        imageUrl: imageUrl,
        description: description,
      };
    });

    this.setData({ favoriteItems });
  },

  
  setDescription(event: any) {
    const { index } = event.currentTarget.dataset;
    const value = event.detail.value;
    const favoriteItems = this.data.favoriteItems.map((item, i) =>
      i === index ? { ...item, description: value } : item
    );
    this.setData({
      favoriteItems,
    });
  },
  // ...
});
