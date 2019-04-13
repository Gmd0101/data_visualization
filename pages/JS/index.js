$(function () {
    $('#dowebok').fullpage({
        // controlArrows: false,
        // navigation: true,
        navigationPosition: "right",
        navigationColor: "#fff",
        continuousVertical: true,
        // slidesNavigation: false
    });
    //自动轮播
    setInterval(function () {
        $.fn.fullpage.moveSectionDown();
    }, 60 * 1000);

    var sideBtn = $('.side-btn');   //按钮
    var sidebar = $('.sidebar');   //侧边栏
    var wrapper = $('.wrapper-one'); // 主体内容
    var main = $('.main');
    var isClosed = true;
    //开关侧边栏
    sideBtn.on('click', function () {
        if (isClosed) {
            sideBtn.removeClass("is-closed");
            sideBtn.addClass("is-open");
            sidebar.addClass("active");
            wrapper.addClass("active");
            main.addClass("active");
            isClosed = false;
        } else {
            sideBtn.removeClass("is-open");
            sideBtn.addClass("is-closed");
            sidebar.removeClass("active");
            wrapper.removeClass("active");
            main.removeClass("active");
            isClosed = true;
        }
    });



    var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    //第一屏右侧销售城市前10*******************************************************************
    var topTenCity = echarts.init($('#city-top-ten')[0]);
    var topTenCityOption = {
        title: {
            text: "当月销售订单城市Top10",
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 14
            }
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "line"
            }
        },
        legend: {
            left: "right",
            textStyle: {
                color: "#fff"
            },
            data: ["订单数"]
        },
        grid: {
            left: "15%",
            top: "20%",
            bottom: "10%"
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 8
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#02238E'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#02238E'
                }
            },
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            axisLabel: {
                color: "#fff",
                interval: 0,        //设置为0强制显示所有标签
                fontSize: clientWidth / 1080 * 8
            },
            data: []
        },
        series: [
            {
                name: '订单数',
                type: 'bar',
                barWidth: "80%",
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                            offset: 0,
                            color: '#00b0ff'
                        }, {
                            offset: 0.8,
                            color: '#7052f4'
                        }], false),
                        // opacity: "0.8"
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    color: "#fff",
                    fontSize: clientWidth / 1080 * 8
                },
                data: []
            }
        ]

    };
    topTenCity.showLoading();
    topTenCity.setOption(topTenCityOption);

    //订单分布地图
    var orderMap = echarts.init($('#order-map')[0]);
    //车辆派送位置*********************************
    var carMap = echarts.init($('#car-map')[0]);
    //实时订单地图
    var currentOrderMap = echarts.init($('#current-order-map')[0]);
    var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
    //业务员位置，第二屏地图******************************************************************
    var salesmanMap = echarts.init($('#salesman-map')[0]);
    //实时订单轮播
    var currentData = [], oldData = [];
    var databox = $('.current-orders-list');
    var currentOrderTimer, currentOrderIndex = 0;

    // function orderScroll() {
    //     if (currentData.length > 5) {
    //         databox.animate({
    //             marginTop: '-40px'
    //         }, 1000, function () {
    //             $(this).css({ marginTop: '0px' }).find('li:first').appendTo(this);
    //         });
    //     }
    // }
    // setInterval(orderScroll, 2000);


    new Promise(function (resolve, reject) {
        //设置标题等
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getTitle",
            dataType: 'json',
            success: function (res) {
                $('.title').text(res.title + "实时数据展示中心");
                var company = res;
                //获取地图
                $.ajax({
                    type: "GET",
                    url: "http://localhost:3000/getMap",
                    success: function (res) {
                        echarts.registerMap('provinceMap', res.guangdong);
                        const geo = {
                            map: 'provinceMap',
                            layoutCenter: ['50%', '50%'],
                            layoutSize: '100%',
                            label: {
                                emphasis: {
                                    show: false
                                }
                            },
                            roma: false,
                            itemStyle: {
                                normal: {
                                    areaColor: '#005bfc',
                                    borderWidth: 2,
                                    borderColor: '#0143e4'
                                },
                                emphasis: {
                                    areaColor: "#69"
                                }
                            }
                        };
                        orderMap.showLoading();
                        //订单分布地图设置
                        orderMap.setOption({
                            title: {
                                text: '订单数量分布',
                                x: "left",
                                textStyle: {
                                    color: "#fff",
                                    fontSize: clientWidth / 1080 * 14
                                }
                            },
                            visualMap: {
                                show: false,
                                min: 0,
                                max: 5000,
                                calculable: true,
                                right: '5%',
                                inRange: {
                                    color: ['red', 'red', 'red']
                                },
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            geo: geo,
                            series: [
                                {
                                    name: '订单城市分布',
                                    type: 'heatmap',
                                    coordinateSystem: 'geo',
                                    data: []
                                }
                                // {
                                //     name: '订单城市分布',
                                //     type: 'scatter',
                                //     coordinateSystem: 'geo',
                                //     data: [],
                                //     symbolSize: 12,
                                //     label: {
                                //         normal: {
                                //             show: false
                                //         },
                                //         emphasis: {
                                //             show: false
                                //         }
                                //     },
                                //     itemStyle: {
                                //         emphasis: {
                                //             borderColor: '#fff',
                                //             borderWidth: 1
                                //         }
                                //     }
                                // }
                            ]
                        });
                        //实时订单地图设置
                        currentOrderMap.setOption({
                            title: {
                                text: '实时订单分布',
                                x: "left",
                                textStyle: {
                                    color: "#fff",
                                    fontSize: clientWidth / 1080 * 14,
                                }
                            },
                            legend: {
                                orient: 'vertical',
                                bottom: "5%",
                                right: "5%",
                                // y: 'center',
                                // x: 'center',
                                data: ['实时订单分布'],
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            visualMap: {
                                //图例值控制
                                min: 0,
                                max: 10000,
                                show: false,
                                calculable: true,
                                color: ["#60FCF8"],
                                textStyle: {
                                    color: "#fff"
                                },

                            },
                            geo: geo,
                            series: [
                                {
                                    name: "实时订单分布",
                                    type: "lines",
                                    zlevel: 1,
                                    effect: {
                                        show: true,
                                        period: 6,
                                        trailLength: 0.7,
                                        color: '#fff',
                                        symbol: "arrow",
                                        symbolSize: 3
                                    },
                                    lineStyle: {
                                        normal: {
                                            color: '#60FCF8',
                                            width: 1,
                                            // opacity: 0.6,
                                            curveness: 0.2
                                        }
                                    },
                                    coordinateSystem: "geo",
                                    data: []
                                },
                                {
                                    name: "实时订单分布",
                                    type: "lines",
                                    zlevel: 2,
                                    symbol: ['none', 'arrow'],
                                    symbolSize: 10,
                                    effect: {
                                        show: true,
                                        period: 6,
                                        trailLength: 0,
                                        symbol: planePath,
                                        symbolSize: 15
                                    },
                                    lineStyle: {
                                        normal: {
                                            color: '#60FCF8',
                                            width: 1,
                                            opacity: 0.6,
                                            curveness: 0.2
                                        }
                                    },
                                    coordinateSystem: "geo",
                                    data: []
                                },
                                {
                                    name: "实时订单分布",
                                    type: "effectScatter",
                                    coordinateSystem: "geo",
                                    zlevel: 2,
                                    rippleEffect: {
                                        //涟漪特效
                                        period: 4, //动画时间，值越小速度越快
                                        brushType: "stroke", //波纹绘制方式 stroke, fill
                                        scale: 4 //波纹圆环最大限制，值越大波纹越大
                                    },
                                    symbol: "circle",
                                    symbolSize: 10,
                                    itemStyle: {
                                        normal: {
                                            show: false,
                                        }
                                    },
                                    data: []
                                }
                            ]
                        });
                        //车辆派送地图设置
                        carMap.setOption({
                            title: {
                                text: '车辆派送位置',
                                x: "left",
                                textStyle: {
                                    color: "#fff",
                                    fontSize: clientWidth / 1080 * 14
                                }
                            },
                            legend: {
                                orient: 'vertical',
                                bottom: "5%",
                                right: "5%",
                                // y: 'center',
                                // x: 'center',
                                data: ['车辆派送位置'],
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            geo: geo,
                            series: [{
                                name: '车辆派送位置',
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                data: [],
                                symbolSize: 10,
                                showEffectOn: 'render',
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                hoverAnimation: true,
                                itemStyle: {
                                    normal: {
                                        color: '#60FCF8',
                                        shadowBlur: 10,
                                        shadowColor: '#333'
                                    }
                                },
                                zlevel: 1
                            }]
                        });
                        //业务员位置地图设置
                        salesmanMap.setOption({
                            title: {
                                text: '业务员位置',
                                x: "left",
                                textStyle: {
                                    color: "#fff",
                                    fontSize: clientWidth / 1080 * 14
                                }
                            },
                            legend: {
                                orient: 'vertical',
                                bottom: "5%",
                                right: "5%",
                                // y: 'center',
                                // x: 'center',
                                data: ['业务员位置'],
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            geo: geo,
                            series: [{
                                name: '业务员位置',
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                data: [],
                                symbolSize: 10,
                                showEffectOn: 'render',
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                hoverAnimation: true,
                                itemStyle: {
                                    normal: {
                                        color: '#48fce0',
                                        shadowBlur: 10,
                                        shadowColor: '#333'
                                    }
                                },
                                zlevel: 1
                            }]
                        });
                        resolve(company);
                    }
                });
            }
        });
    }).then(function (result) {
        //获取所有订单城市**************************************************
        function getAllOrders() {
            $.ajax({
                type: "get",
                url: "http://localhost:3000/getCountTopTenCity",
                dataType: "json",
                success: function (response) {
                    if (response.countTopTenCity.state == '1') {
                        var countTopTenCityData = response.countTopTenCity.data;
                        var orderslist = [];
                        var ordersGeoCoordMap = {}, datalist = [], maxData = 0, minData = 0;


                        countTopTenCityData.forEach(function (item, index) {
                            datalist.push(item.sum);
                            orderslist.push({ name: item.city, value: item.sum });
                        });

                        datalist.sort(function (a, b) {
                            return a - b;
                        });

                        minData = parseInt(datalist[0]) / 2;
                        maxData = parseInt(datalist[datalist.length - 1]) / 2;

                        //解析地址
                        var id = 0;
                        var Geo = new BMap.Geocoder();
                        function parsingAddress() {

                            if (id >= countTopTenCityData.length) {

                                var convertCityData = function (data) {
                                    var res = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var geoCoord = ordersGeoCoordMap[data[i].name];
                                        if (geoCoord) {
                                            res.push({
                                                name: data[i].name,
                                                value: geoCoord.concat(data[i].value)
                                            });
                                        }
                                    }
                                    return res;
                                };


                                orderMap.hideLoading();
                                orderMap.setOption({
                                    visualMap: {
                                        min: minData,
                                        max: maxData
                                    },
                                    series: [
                                        {
                                            name: '订单城市分布',
                                            type: 'heatmap',
                                            data: convertCityData(orderslist)
                                        }
                                    ]
                                });
                                return;
                            }
                            Geo.getPoint(countTopTenCityData[id].city, function (point) {
                                if (point) {
                                    ordersGeoCoordMap[countTopTenCityData[id].city] = [point.lng, point.lat];
                                }
                                id++;
                                parsingAddress();
                            });
                        }
                        parsingAddress();

                        var newList = countTopTenCityData.slice(0, 10);
                        var cityname = [], citysalesnum = [];
                        newList.forEach(function (item, index) {
                            cityname.push(item.city);
                            citysalesnum.push(item.sum);
                        });
                        topTenCity.hideLoading();
                        topTenCity.setOption({
                            yAxis: {
                                type: 'category',
                                data: cityname.reverse(),
                            },
                            series: [
                                {
                                    name: "订单数",
                                    type: "bar",
                                    data: citysalesnum.reverse()
                                }
                            ]
                        });
                    }
                }
            });
        }
        getAllOrders();
        setInterval(function () { getAllOrders(); }, 20 * 1000);


        //获取实时订单
        function getCurrentOrders() {
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/getcurrentorder",
                dataType: "json",
                success: function (res) {
                    if (res.CurrentOrders.status == '1') {
                        var Geo = new BMap.Geocoder();
                        //添加轮播数据
                        oldData = res.CurrentOrders.data;
                        if (oldData.length != currentData.length) {


                            //地图设置
                            var currentOrdersData = res.CurrentOrders.data;
                            var dgdata = [],
                                title = result.title,
                                address = result.address,
                                currentOrdersGeoCoordMap = {},
                                centerPoint = result.title;


                            Geo.getPoint(address, function (point) {
                                if (point) {
                                    currentOrdersGeoCoordMap[title] = [point.lng, point.lat];
                                }
                            });



                            currentOrdersData.forEach(function (item, index) {
                                dgdata.push([
                                    { name: item.address, value: item.sum }, { name: centerPoint }
                                ]);
                            });


                            //逆地址解析
                            var id = 0;
                            function parsingAddress() {
                                if (id >= currentOrdersData.length) {
                                    //全部解析之后设置地图

                                    var convertCurrentOrdersData = function (data) {
                                        var res = [];
                                        for (var i = 0; i < data.length; i++) {
                                            var dataItem = data[i];
                                            var fromCoord = currentOrdersGeoCoordMap[dataItem[0].name];
                                            var toCoord = currentOrdersGeoCoordMap[dataItem[1].name];
                                            if (fromCoord && toCoord) {
                                                res.push([{
                                                    coord: fromCoord,
                                                    value: dataItem[0].value
                                                },
                                                {
                                                    coord: toCoord
                                                }
                                                ]);
                                            }
                                        }
                                        return res;
                                    };


                                    currentOrderMap.setOption({
                                        series: [
                                            {
                                                name: "实时订单分布",
                                                data: convertCurrentOrdersData(dgdata)
                                            },
                                            {
                                                name: "实时订单分布",
                                                data: convertCurrentOrdersData(dgdata)
                                            },
                                            {
                                                name: "实时订单分布",
                                                type: "effectScatter",
                                                data: dgdata.map(function (dataItem) {
                                                    return {
                                                        name: dataItem[1].name,
                                                        value: currentOrdersGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                                                    };
                                                })
                                            }
                                        ]
                                    });
                                    return;
                                }
                                Geo.getPoint(currentOrdersData[id].address, function (point) {
                                    if (point) {
                                        currentOrdersGeoCoordMap[currentOrdersData[id].address] = [point.lng, point.lat];
                                    }
                                    id++;
                                    parsingAddress();
                                });
                            }
                            parsingAddress();

                            //添加轮播数据
                            currentData = oldData;
                            databox.empty();
                            // databox.css({
                            //     'transition': 'none',
                            //     'margin-top': 0 + 'px'
                            // });
                            // ind = 0;
                            currentData.forEach(function (item, index) {
                                databox.append('<li>' + '<span>' + item.clientName + '</span>' + '<span>' + item.sum + '</span>' + '</li>');
                            });

                            if (currentOrderTimer) { clearInterval(currentOrderTimer); }
                            currentOrderTimer = setInterval(function () {
                                databox.animate({
                                    marginTop: '-40px'
                                }, 1000, function () {
                                    $(this).css({ marginTop: '0px' }).find('li:first').appendTo(this);
                                });
                            }, 2000);
                            // function orderScroll() {
                            //     if (currentData.length > 5) {
                            //         databox.animate({
                            //             marginTop: '-40px'
                            //         }, 1000, function () {
                            //             $(this).css({ marginTop: '0px' }).find('li:first').appendTo(this);
                            //         });
                            //     }
                            // }
                            // setInterval(orderScroll, 2000);
                        }
                    }
                }
            });
        }
        getCurrentOrders();
        setInterval(function () { getCurrentOrders(); }, 5000);

        //获取车辆位置
        function getCarLocation() {
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/getCarLocation",
                dataType: "json",
                success: function (res) {
                    if (res.carLocation.status == '1') {
                        var carLocationData = res.carLocation.data;
                        var carlist = [], carGeoCoordMap = {};
                        carLocationData.forEach(function (item, index) {
                            carlist.push({ name: item.addr, car: item.label });
                            carGeoCoordMap[item.addr] = [item.longitude, item.latitude];
                        });
                        var convertCarLocationData = function (data) {
                            var res = [];
                            for (var i = 0; i < data.length; i++) {
                                var geoCoord = carGeoCoordMap[data[i].name];
                                if (geoCoord) {
                                    res.push({
                                        name: data[i].car,
                                        address: data[i].name,
                                        value: geoCoord.concat(data[i].value)
                                    });
                                }
                            }
                            return res;
                        };
                        carMap.setOption({
                            series: [
                                {
                                    name: '车辆派送位置',
                                    data: convertCarLocationData(carlist)
                                }
                            ]
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
        getCarLocation();
        setInterval(function () {
            getCarLocation();
        }, 20 * 1000);

        //获取业务员位置********************************************************************
        function getSalesmanLocation() {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://localhost:3000/getCurrentCoordinate",
                success: function (res) {
                    if (res.currentCoordinate.status == '1') {
                        var currentCoordinateData = res.currentCoordinate.data;
                        var salesmanlist = [], salesmanGeoCoordMap = {};
                        currentCoordinateData.forEach(function (item, index) {
                            salesmanlist.push({
                                name: item.coordinate[0].addr,
                                salesman: item.coordinate[0].label,
                                datetime: item.coordinate[0].time
                            });
                            salesmanGeoCoordMap[item.coordinate[0].addr] = [item.coordinate[0].lng, item.coordinate[0].lat];
                        });
                        var convertData2 = function (data) {
                            var res = [];
                            for (var i = 0; i < data.length; i++) {
                                var geoCoord = salesmanGeoCoordMap[data[i].name];
                                if (geoCoord) {
                                    res.push({
                                        name: data[i].salesman,
                                        address: data[i].name,
                                        datetime: data[i].datetime,
                                        value: geoCoord.concat(data[i].value)
                                    });
                                }
                            }
                            return res;
                        };
                        salesmanMap.setOption({
                            series: [{
                                name: "业务员位置",
                                data: convertData2(salesmanlist)
                            }]
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
        getSalesmanLocation();
        setInterval(function () {
            getSalesmanLocation();
        }, 20 * 1000);
    });


    //第一屏右侧上-品牌销量前5 饼图**********************************************************
    var brandPie = echarts.init($('#brand-pie')[0]);
    var brandOption = {
        title: {
            text: '品牌月销量',
            x: 'left',
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 14
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            itemWidth: clientWidth / 1080 * 14,
            itemHeight: clientWidth / 1080 * 8,
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 8
            },
            data: []
        },
        series: [
            {
                name: '品牌销量',
                type: 'pie',
                radius: ['40%', '60%'],
                // left: '0%',
                // top: 40,
                // bottom: 30,
                center: ['42%', '60%'],
                label: {
                    normal: {
                        show: true,
                        position: "outside",
                        textStyle: {
                            fontSize: clientWidth / 1080 * 8
                        },
                        formatter: "{d}%"
                    }
                },
                data: [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    brandPie.showLoading();
    brandPie.setOption(brandOption);
    //轮胎品牌销量前5(柱状图)，第二屏左侧底部
    var categoryTopFive = echarts.init(document.getElementById('category-top-five'));
    var categoryTopFiveOption = {
        title: {
            text: '轮胎品牌销量Top5',
            x: 'left',
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 14
            }
        },
        color: ['#3398DB'],
        legend: {
            // orient: 'vertical',
            left: 'right',
            itemWidth: clientWidth / 1080 * 14,
            itemHeight: clientWidth / 1080 * 8,
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 8
            },
            data: ['当月销售数量']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#02238e'
                    }
                },
                axisLabel: {
                    color: "#fff",
                    interval: 0,
                    fontSize: clientWidth / 1080 * 8
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#02238e'
                    }
                },
                axisLabel: {
                    color: "#fff",
                    fontSize: clientWidth / 1080 * 8
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#02238E'
                    }
                },
            },

        ],
        series: [
            {
                name: '当月销售数量',
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00b0ff'
                        }, {
                            offset: 0.8,
                            color: '#7052f4'
                        }], false)
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    color: "#fff",
                },
                barWidth: '50%',
                data: []
            }
        ]
    };
    categoryTopFive.showLoading();
    categoryTopFive.setOption(categoryTopFiveOption);
    //获取品牌前5销量，第一屏右上
    function CountCurrentMonthTagTotalsales() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getCountCurrentMonthTagTotalsales",
            dataType: "json",
            success: function (response) {
                if (response.countCurrentMonthTagTotalsales.state == '1') {
                    var colorList = ['#ffaefd', '#10f6ec', '#fd9c35', '#fd35d6', '#8448ff', '#d1ed7f'];
                    const monthTagTotalSalesData = response.countCurrentMonthTagTotalsales.data;
                    var tag = [], tagSum = [];
                    //品牌前五  
                    var tagTopFive = [], tagTopFiveSum = [];


                    monthTagTotalSalesData.slice(0, 5).forEach(function (item, index) {
                        tagTopFive.push(item.tag);
                        tagTopFiveSum.push(item.tagSum);
                    });
                    categoryTopFive.hideLoading();
                    categoryTopFive.setOption({
                        xAxis: {
                            data: tagTopFive
                        },
                        series: [{
                            name: '当月销售数量',
                            data: tagTopFiveSum
                        }]
                    });


                    monthTagTotalSalesData.forEach(function (item, index) {
                        tag.push(item.tag);
                        tagSum.push({ value: item.tagSum, name: item.tag });
                    });
                    if (tagSum.length > 0) {
                        tagSum.forEach(function (item, index) {
                            item.itemStyle = { color: colorList[index] };
                        });
                    }
                    brandPie.hideLoading();
                    brandPie.setOption({
                        legend: {
                            data: tag
                        },
                        series: [
                            {
                                name: '品牌销量',
                                data: tagSum
                            }
                        ]
                    });
                }
            }
        });
    }
    CountCurrentMonthTagTotalsales();
    setInterval(function () {
        CountCurrentMonthTagTotalsales();
    }, 20 * 1000);


    //第一屏中间底部-月销售统计********************************************************************
    var monthSales = echarts.init($('#month-sales')[0]);
    var monthSalesOption = {
        title: {
            show: true,
            text: '',
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 14
            }
        },
        grid: {
            left: "10%",
            right: "5%",
            bottom: "15%"
        },
        color: "#43d0d6",
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            right: "5%",
            top: "5%",
            textStyle: { color: "#fff" },
            data: ["日销量"],
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 8
            }
        },
        //x轴设置
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#02238E'
                }
            },
            axisLabel: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 8
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#000'
                }
            },
            data: []
        },
        //y轴设置
        yAxis: {
            type: 'value',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#02238e'
                }
            },
            axisLabel: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 8
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#02238E'
                }
            },
        },
        series: [{
            name: "日销量",
            data: [],
            type: 'line',
            itemStyle: {
                borderColor: "#43d0d6"
            },
            lineStyle: {
                color: "#43d0d6"
            },
            // areaStyle: {
            //     color: "#60FCF8",
            //     opacity: "0.2"
            // },
            markPoint: {
                symbol: 'pin',
                symbolSize: 40,
                itemStyle: {
                    color: "coral"
                },
                label: {
                    color: "#fff"
                },
                data: [
                    { type: 'max', name: "月最高" },
                    { type: 'min', name: "月最低" }
                ]
            }
        }]
    };

    monthSales.showLoading();
    monthSales.setOption(monthSalesOption);
    //获取当月每日销量统计，第一屏中下
    function getMonthSales() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getCurrentMonthSales",
            dataType: "json",
            success: function (res) {
                if (res.currentMonthSales.state == '1') {
                    var dayList = [], daySumList = [];
                    var currentMonthSalesData = res.currentMonthSales.data.salesdate;
                    var month = res.currentMonthSales.data.month;
                    currentMonthSalesData.forEach(function (item, index) {
                        dayList.push(item.day);
                        daySumList.push(item.sum);
                    });
                    monthSales.hideLoading();
                    monthSales.setOption({
                        title: {
                            text: month + "销量统计"
                        },
                        xAxis: {
                            data: dayList
                        },
                        series: [
                            {
                                name: "日销量",
                                data: daySumList
                            }
                        ]
                    });
                }
            }
        });
    }
    getMonthSales();
    setInterval(function () {
        getMonthSales();
    }, 20 * 1000);


    function getTotalSalesYMD() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/gettotalsalesYMD",
            dataType: "json",
            success: function (res) {
                if (res.totalsalesYMD.state == '1') {
                    const totalsalesdata = res.totalsalesYMD.data;
                    $('.daysumOrder').html(totalsalesdata.day.sumOrder);
                    $('.daysumNum').html(totalsalesdata.day.sumNum);
                    $('.daysumPrice').html((totalsalesdata.day.sumPrice / 10000).toFixed(2) + '<span>万元</span>');
                    $('.monthsumOrder').html(totalsalesdata.month.sumOrder);
                    $('.monthsumNum').html(totalsalesdata.month.sumNum);
                    $('.monthsumPrice').html((totalsalesdata.month.sumPrice / 10000).toFixed(2) + '<span>万元</span>');
                    $('.yearsumOrder').html(totalsalesdata.year.sumOrder);
                    $('.yearsumNum').html(totalsalesdata.year.sumNum);
                    $('.yearsumPrice').html((totalsalesdata.year.sumPrice / 10000).toFixed(2) + '<span>万元</span>');
                } else {
                    alert('获取数据失败!');
                }
            }
        });
    }
    getTotalSalesYMD();
    setInterval(function () {
        getTotalSalesYMD();
    }, 20 * 1000);



    //第一屏地图轮播
    function scroll() {
        var mapbox = $('.mapbox');
        //浏览器窗口可视区域高度
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var hei = (clientHeight - 60) * 0.666666666666;
        var index = 0;
        setInterval(function () {
            index++;
            mapbox.css({
                'transition': 'all 2s',
                'margin-top': -hei * index + 'px'
            });
            if (index == 3) {
                mapbox.css({
                    'transition': 'none',
                    'margin-top': 0 + 'px'
                });
                index = 0;
            }
        }, 20 * 1000);
    }
    scroll();


});