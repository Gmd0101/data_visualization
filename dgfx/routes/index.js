var express = require('express');
var router = express.Router();
var br = require('../public/data/brand.json');
var brand = br.brand;
//业务员销售信息
var salesman = require('../public/data/salesman.json')
var salesmanmsg = salesman.salesman;
//订单信息（实时订单、当月当日信息、销售城市前10）
var od = require('../public/data/orders.json');
//当月、日销售统计
var sellInfo = od.sellInfo;
var cityorder = od.cityOrder;
var currentorder = od.currentOrders;


//实时订单
var CurrentOrders = require('../public/data/CurrentOrders.json');
//年月日销量
var totalsalesYMD = require('../public/data/totalsalesYMD.json');
//品牌总销量top5
var countCurrentMonthTagTotalsales = require('../public/data/countCurrentMonthTagTotalsales.json');
//当年每月销量统计
var currentYearSales = require('../public/data/currentYearSales.json');
//各类型销量统计
var countCurrentMonthClassTotalsales = require('../public/data/countCurrentMonthClassTotalsales.json');
//业务员位置
var currentCoordinate = require('../public/data/currentCoordinate.json');
//车辆位置
var carLocation = require('../public/data/carLocation.json');
//城市前10
var countTopTenCity = require('../public/data/countTopTenCity.json');
//当月每日销量统计
var currentMonthSales = require('../public/data/currentMonthSales.json');
//销售排名
var salesmanTopTen = require('../public/data/persontopten.json');
// 品牌前五
var tagMonthSales = require('../public/data/tagMonthSales.json');
//地区销量
var currentArea = require('../public/data/currentArea.json');







//当月销量
var sells = require('../public/data/sells.json');
var monthsells = sells.monthsales;
//每月总销量、各部门总销量、各品牌当月销量、各轮胎类型总销量、各类型在地区销量
var totalsales = require('../public/data/totalsells.json');

//地图数据
var map = require('../public/data/map.json');


//测试
var demo = require('../public/data/demo1.json');
var sales = demo.sales;

//test
var mymsg = require('../public/data/my.json');

//请求头设置
router.all('*', function (req, res, next) {
  // 设置访问的权限
  res.header("Access-Control-Allow-Origin", "*");
  // 设置支持ajax请求
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // 设置支持的请求方法
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // 设置服务器端开发平台
  // res.header("X-Powered-By", 'express');
  // 设置的响应的文本类型（mime type)和编码规则（不让产生乱码）
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getcurrentorder', function (req, res, next) {
  res.json({ CurrentOrders });
});
router.get('/gettotalsalesYMD', function (req, res, next) {
  res.json({ totalsalesYMD });
});
router.get('/getCountCurrentMonthTagTotalsales', function (req, res, next) {
  res.json({ countCurrentMonthTagTotalsales });
});
router.get('/getCurrentYearSales', function (req, res, next) {
  res.json({ currentYearSales });
});
router.get('/getCountCurrentMonthClassTotalsales', function (req, res) {
  res.json({ countCurrentMonthClassTotalsales });
});
router.get('/getCurrentCoordinate', function (req, res, next) {
  res.json({ currentCoordinate });
});
router.get('/getCarLocation', function (req, res, next) {
  res.json({ carLocation });
});
router.get('/getCountTopTenCity', function (req, res, next) {
  res.json({ countTopTenCity });
});
router.get('/getCurrentMonthSales', function (req, res, next) {
  res.json({ currentMonthSales });
});
router.get('/getSalesmanTopTen', function (req, res, next) {
  res.json({ salesmanTopTen });
});
router.get('/getTagMonthSales', function (req, res, next) {
  res.json({ tagMonthSales });
});
router.get('/getCurrentArea', function (req, res, next) {
  res.json({ currentArea });
});

router.get('/getTitle', function (req, res, next) {
  res.json({ title: "东莞富兴贸易有限公司", address: '东莞市' });
});

var guangdong = require('../public/data/province/guangdong.json');
router.get('/getMap', function (req, res, next) {
  res.json({ guangdong });
});

var countTagMonthOutStore = require('../public/tagMonthSales.json');
router.get('/getCountTagMonthOutStore', function (req, res, next) {
  res.json(countTagMonthOutStore);
});











var newrouter = require('../public/data/router.json');
router.get('/getrouter', function (req, res, next) {
  res.json({ newrouter });
});





router.post('/demo', function (req, res, next) {
  res.json({ sales });
  // if (req.query.callback) {
  //   res.send(req.query.callback + "(" + JSON.stringify(sales) + ")");
  // } else {
  //   res.json({ sales });
  // }
});

//test
router.post('/my', function (req, res, next) {
  return res.json({ mymsg });
});

router.post('/getdata', function (req, res, next) {
  res.json({ "name": "gmd" });
});


//业务员销售排名
router.post('/msg', function (req, res, next) {
  console.log(req.body.time);
  res.json({ salesmanmsg });
});

router.get('/getorder', function (req, res, next) {

  if (req.query.callback) {
    res.send(req.query.callback + '(' + JSON.stringify(currentorder) + ")");
  } else {
    res.json({ currentorder });
  }
});

router.get('/getsellinfo', function (req, res, next) {

  if (req.query.callback) {
    res.send(req.query.callback + '(' + JSON.stringify(sellInfo) + ")");
  } else {
    res.json({ sellInfo });
  }
});

router.get('/getcityorder', function (req, res, next) {

  if (req.query.callback) {
    res.send(req.query.callback + '(' + JSON.stringify(cityorder) + ")");
  } else {
    res.json({ cityorder });
  }
});

router.get('/getbrand', function (req, res, next) {

  if (req.query.callback) {
    res.send(req.query.callback + '(' + JSON.stringify(brand) + ")");
  } else {
    res.json({ brand });
  }
});

router.get('/getmonthsales', function (req, res, next) {

  if (req.query.callback) {
    res.send(req.query.callback + '(' + JSON.stringify(monthsells) + ")");
  } else {
    res.json({ monthsells });
  }
});

router.get('/gettotalsales', function (req, res, next) {

  if (req.query.callback) {
    res.send(req.query.callback + '(' + JSON.stringify(totalsales) + ")");
  } else {
    res.json({ totalsales });
  }
});

router.get('/getmap', function (req, res, next) {

  if (req.query.callback) {
    res.send(req.query.callback + '(' + JSON.stringify(map) + ")");
  } else {
    res.json({ map });
  }
});


module.exports = router;
