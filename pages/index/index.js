const weatherMap={
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
const QQMapWX = require('../lib/qqmap-wx-jssdk.js')
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2
Page({
  date:{
    forecastMap:[],
    todayDay:'',
    todayTemp:'',
    nowTemp:'',
    nowWeather:'',
    weatherBackPath:'sunny',
  },
  
  onLoad(){
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    })
    this.getCityAndWeather()
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        console.log(auth)
        this.setData({
          locationAuthType: auth ? AUTHORIZED
            : (auth === false) ? UNAUTHORIZED : UNPROMPTED
        })

        if (auth)
          this.getCityAndWeather()
        else
          this.getNow() //使用默认城市广州
      },
      fail: () => {
        this.getNow() //使用默认城市广州
      }
    })
  },

  getNow(){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city:'成都'
      },
      success:res=>{
        console.log(res)
        let result = res.data.result
        this.getForecast(result)
        this.setToday(result)
      }
    })
  },

  setToday(result){
    let todayDate = new Date()
    let todayTempScope = result.today
    this.setData({
      todayDay: `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`+' 今天',
      todayTemp: todayTempScope.minTemp + '℃~' + todayTempScope.maxTemp +'℃',
      nowTemp: result.now.temp+'℃',
      nowWeather:weatherMap[result.now.weather],
      weatherBackPath: '../images/'+result.now.weather+'-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[result.now.weather],
    })
  },
  
  onTapWeekWeather(){
    wx.navigateTo({
      url: '../list/list',
    })
  },

  onTapLocation(){
    wx.openSetting({
      
    })
  },

  getForecast(result){
    let forecastMap = []
    let nowTime = new Date().getHours()
    for(let i=0;i<8;i++){
      forecastMap.push({
        time:(nowTime+i*3)%24+'时',
        weatherIcon: result.forecast[i].weather,
        temp: result.forecast[i].temp
      })
    }
    forecastMap[0].time = '现在'
    this.setData({
      forecastMap: forecastMap
    })
  },

  getCityAndWeather() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
            this.setData({
              city: city,
            })
            this.getNow()
          }
        })
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED,
        })
      }
    })
  }
})

