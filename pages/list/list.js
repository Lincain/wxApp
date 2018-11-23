// pages/list/list.js
const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',]


Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneWeather:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data:{
        time:new Date().getTime(),
        city:'成都'
      },
      success:res=>{
        this.setWeekWeather(res.data.result)
      }
    })
  },
  setWeekWeather(result){
    let oneWeather = []
    for(let i=0;i<7;i++){
      let date = new Date()
      date.setDate(date.getDate()+i)
      oneWeather.push({
        todayTime:dayMap[date.getDay()],
        dateTime:`${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`,
        tempScope:`${result[i].minTemp}℃~${result[i].maxTemp}℃`,
        iconPath:result[i].weather
      })
    }
    oneWeather[0].todayTime = '今天'
    this.setData({
      oneWeather: oneWeather
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})