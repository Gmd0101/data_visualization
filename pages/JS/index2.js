$(function () {
    var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    //大小胎轮播
    var salesmanBigTyreData = [], oldSalesmanBigTyreData = [], salesmanSmallTyreData = [], oldSalesmanSmallTyreData = [];
    var salesmanbox1 = $('.salesmanbig-list-item');
    var salesmanbox2 = $('.salesmansmall-list-item');
    //浏览器可是区域高度
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    var salesmanDataBoxH = (clientHeight - 90) / 2 - 80;

    var bidTyreIndex = 0, smallTyreIndex = 0;
    
    setInterval(function () {
        bidTyreIndex++;
        salesmanbox1.css({
            marginTop: -salesmanDataBoxH * bidTyreIndex + 'px',
            transition: 'all 4s'
        });
        if (bidTyreIndex == Math.ceil(salesmanBigTyreData.length / 10)) {
            setTimeout(function () {
                bidTyreIndex = 0;
                salesmanbox1.css({
                    marginTop: 0 + 'px',
                    transition: 'none'
                });
            }, 4000);
        }
    }, 10 * 1000);

    setInterval(function () {
        smallTyreIndex++;
        salesmanbox2.css({
            marginTop: -salesmanDataBoxH * smallTyreIndex + 'px',
            transition: 'all 4s'
        });
        if (smallTyreIndex == Math.ceil(salesmanSmallTyreData.length / 10)) {
            setTimeout(function () {
                smallTyreIndex = 0;
                salesmanbox2.css({
                    marginTop: 0 + 'px',
                    transition: 'none'
                });
            }, 4000);
        }
    }, 10 * 1000);

    // setInterval(function () {
    //     salesmanbox1.animate({ marginTop: '-40px' }, 1000, function () {
    //         $(this).css({ marginTop: '0px' }).find('li:first').appendTo(this);
    //     });
    //     salesmanbox2.animate({ marginTop: '-40px' }, 1000, function () {
    //         $(this).css({ marginTop: '0px' }).find('li:first').appendTo(this);
    //     });
    // }, 2000);




    //获取大胎数据
    function getSalesmanBigTyre() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getSalesmanTopTen",
            dataType: "json",
            success: function (res) {
                if (res.salesmanTopTen.state == '1') {
                    var salesmanTopTenData = res.salesmanTopTen.data;
                    oldSalesmanBigTyreData = salesmanTopTenData;
                    // if (salesmanBigTyreData.length != oldSalesmanBigTyreData.length) {
                    salesmanBigTyreData = oldSalesmanBigTyreData;
                    salesmanbox1.empty();
                    salesmanbox1.css({
                        'transition': 'none',
                        'margin-top': 0 + 'px'
                    });
                    // index = 0;
                    //需要补得空白条数
                    var emptyItem = 10 - salesmanBigTyreData.length % 10;
                    salesmanBigTyreData.forEach(function (item, index) {
                        salesmanbox1.append('<li>' + '<span>' + (index + 1) + '</span>' + '<span>' + item.personnelName + '</span>' + '<span>' + item.sum + '</span>' + '</li>');
                    });
                    for (var i = 0; i < emptyItem; i++) {
                        salesmanbox1.append('<li>');
                    }
                    salesmanBigTyreData.slice(0, 10).forEach(function (item, index) {
                        salesmanbox1.append('<li>' + '<span>' + (index + 1) + '</span>' + '<span>' + item.personnelName + '</span>' + '<span>' + item.sum + '</span>' + '</li>');
                    });
                    // }
                }
            }
        });
    }
    getSalesmanBigTyre();

    //获取小胎数据
    function getSalesmanSmallTyre() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getSalesmanTopTen",
            dataType: "json",
            success: function (res) {
                if (res.salesmanTopTen.state == '1') {
                    var salesmanTopTenData = res.salesmanTopTen.data;
                    oldSalesmanSmallTyreData = salesmanTopTenData;
                    // if (salesmanSmallTyreData.length != oldSalesmanSmallTyreData.length) {
                    console.log('有新的小胎排名');
                    salesmanSmallTyreData = oldSalesmanSmallTyreData;
                    salesmanbox2.empty();
                    salesmanbox2.css({
                        'transition': 'none',
                        'margin-top': 0 + 'px'
                    });
                    // index = 0;
                    //需要补得空白条数
                    var emptyItem = 10 - salesmanSmallTyreData.length % 10;
                    salesmanSmallTyreData.forEach(function (item, index) {
                        salesmanbox2.append('<li>' + '<span>' + (index + 1) + '</span>' + '<span>' + item.personnelName + '</span>' + '<span>' + item.sum + '</span>' + '</li>');
                    });
                    for (var i = 0; i < emptyItem; i++) {
                        salesmanbox2.append('<li>');
                    }
                    salesmanSmallTyreData.slice(0, 10).forEach(function (item, index) {
                        salesmanbox2.append('<li>' + '<span>' + (index + 1) + '</span>' + '<span>' + item.personnelName + '</span>' + '<span>' + item.sum + '</span>' + '</li>');
                    });
                    // }
                }
            }
        });
    }
    getSalesmanSmallTyre();
    setInterval(function () {
        getSalesmanBigTyre(); getSalesmanSmallTyre();
    }, 180 * 1000);

    //类型月销量统计,第一屏右下*****************************************************
    var typeTopFive = echarts.init($('#type-top-five')[0]);
    var typeTopFiveOption = {
        title: {
            text: '类型月销量',
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
        grid: {
            left: 0
        },
        series: [
            {
                name: '类型月销量',
                type: 'pie',
                radius: ['40%', '60%'],
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
                center: ['42%', '60%'],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: []
            }
        ]
    };
    typeTopFive.showLoading();
    typeTopFive.setOption(typeTopFiveOption);
    //获取类型统计
    var colorList = ['#ffaefd', '#10f6ec', '#fd9c35', '#fd35d6', '#8448ff', '#d1ed7f'];
    function getMonthTypeTotalsales() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getCountCurrentMonthClassTotalsales",
            dataType: "json",
            success: function (res) {
                if (res.countCurrentMonthClassTotalsales.state == "1") {
                    var classlist = [], classsumlist = [];
                    var countCurrentMonthClassTotalsalesData = res.countCurrentMonthClassTotalsales.data;
                    countCurrentMonthClassTotalsalesData.forEach(function (item, index) {
                        classlist.push(item.class);
                        classsumlist.push({ value: item.classSum, name: item.class });
                    });
                    if (classsumlist.length > 0) {
                        classsumlist.forEach(function (item, index) {
                            item.itemStyle = { color: colorList[index] }
                        });
                    }

                    typeTopFive.hideLoading();
                    typeTopFive.setOption({
                        legend: {
                            data: classlist
                        },
                        series: [
                            {
                                name: '类型月销量',
                                type: 'pie',
                                data: classsumlist
                            }
                        ]
                    });
                } else {
                    console.log('获取数据出错!');
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
    getMonthTypeTotalsales();
    setInterval(function () { getMonthTypeTotalsales(); }, 20 * 1000);

    //**********************年销售统计，第二屏中下************************************
    var yearSales = echarts.init($('#year-sales')[0]);
    var yearSalesOption = {
        title: {
            show: true,
            text: "",
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 14
            }
        },
        grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        color: "#43d0d6",
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['月销量'],
            right: "5%",
            top: "5%",
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
            name: "月销量",
            type: 'line',
            itemStyle: {
                borderColor: "#43d0d6"
            },
            lineStyle: {
                color: "#43d0d6"
            },
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
            },
            data: []
        }]
    };
    yearSales.showLoading();
    yearSales.setOption(yearSalesOption);
    //获取年销售统计数据
    function getYearSales() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getCurrentYearSales",
            dataType: "json",
            success: function (res) {
                if (res.currentYearSales.state == '1') {
                    var monthlist = [], sumlist = [];
                    var yearSalesData = res.currentYearSales.data;
                    var titleText = yearSalesData.year + "年总销量统计";
                    yearSalesData.salesdate.forEach(function (item, index) {
                        monthlist.push(item.month);
                        sumlist.push(item.sum);
                    });
                    yearSales.hideLoading();
                    yearSales.setOption({
                        title: {
                            text: titleText
                        },
                        xAxis: {
                            data: monthlist
                        },
                        series: [
                            {
                                name: "月销量",
                                type: "line",
                                data: sumlist
                            }
                        ]
                    });
                } else {
                    console.log('获取年销售数据失败!');
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
    getYearSales();
    setInterval(function () {
        getYearSales();
    }, 20 * 1000);


    //各品牌销售统计，第二屏中下**********************************************************
    var tagOne = echarts.init($('#tagOne')[0]);
    var tagOption = {
        title: {
            show: true,
            text: "品牌销量Top5",
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 14
            }
        },
        color: ['#ffaefd', '#10f6ec', '#fd9c35', '#fd35d6', '#8448ff', '#d1ed7f'],
        legend: {
            right: "5%",
            textStyle: {
                color: "#fff"
            },
            data: [],
            borderColor: "red"
        },
        grid: {
            left: "10%",
            right: "5%",
            bottom: "15%"
        },
        // color: "#fff",
        // tooltip: {
        //     trigger: "axis",
        //     axisPointer: {
        //         type: 'shadow'
        //     }
        // },
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
        series: []
    };
    tagOne.setOption(tagOption);
    //获取各品牌销售统计，第二屏中下*************************************************
    var tagMonthSalesData = [];
    function getTagMonthSales() {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/getCountTagMonthOutStore",
            dataType: "json",
            success: function (res) {
                if (res.state == '1') {
                    var legendData = [], xAxisData = [];
                    tagMonthSalesData = res.data;
                    tagMonthSalesData.slice(0, 5).forEach(function (item, index) {
                        legendData.push(item.tagName);
                    });
                    //设置x轴
                    if (tagMonthSalesData.length > 0) {
                        tagMonthSalesData[0].salesData.forEach(function (item, index) {
                            xAxisData.push(item.month);
                        });
                    }
                    var series = [];
                    var colorList = ['#ffaefd', '#10f6ec', '#fd9c35', '#fd35d6', '#8448ff', '#d1ed7f'];

                    var iLength = 0;
                    iLength = tagMonthSalesData.length >= 5 ? 5 : tagMonthSalesData.length;

                    for (var i = 0; i < iLength; i++) {
                        series.push({
                            name: tagMonthSalesData[i].tagName,
                            type: "line",
                            lineStyle: {
                                color: colorList[i]
                            },
                            data: []
                        });
                        for (var j = 0; j < tagMonthSalesData[i].salesData.length; j++) {
                            series[i].data.push(tagMonthSalesData[i].salesData[j].tagSum);
                        }
                    }
                    tagOne.setOption({
                        legend: {
                            data: legendData
                        },
                        xAxis: {
                            data: xAxisData
                        },
                        series: series
                    });




                } else {
                    console.log('获取数据出错!');
                }
            }
        });
    }
    getTagMonthSales();
    setInterval(function () { getTagMonthSales(); }, 5 * 1000);

    //地区销售统计，第二屏右下*****************************************************
    var tagOneArea = echarts.init($('#tagOneArea')[0]);
    var tagTwoArea = echarts.init($('#tagTwoArea')[0]);
    var tagThreeArea = echarts.init($('#tagThreeArea')[0]);
    var tagFourArea = echarts.init($('#tagFourArea')[0]);
    var tagAreaOption = {
        title: {
            text: '',
            x: 'left',
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 14
            }
        },
        // color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            left: 'right',
            itemWidth: clientWidth / 1080 * 14,
            itemHeight: clientWidth / 1080 * 8,
            textStyle: {
                color: "#fff",
                fontSize: clientWidth / 1080 * 8
            },
            data: ["月销售数量"]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                // name: "类型一",
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
                    fontSize: clientWidth / 1080 * 8
                }
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
                name: '月销售数量',
                type: 'bar',
                barWidth: '50%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00b0ff'
                        }, {
                            offset: 0.8,
                            color: '#7052f4'
                        }], false),
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    color: "#fff",
                },
                data: []
            }
        ]
    };
    tagOneArea.showLoading();
    tagOneArea.setOption(tagAreaOption);
    tagTwoArea.setOption(tagAreaOption);
    tagThreeArea.setOption(tagAreaOption);
    tagFourArea.setOption(tagAreaOption);
    //获取地区销售数据
    var areaLength = 1;
    function getAreaSales() {
        $.ajax({
            type: "get",
            url: "http://localhost:3000/getCurrentArea",
            dataType: "json",
            success: function (response) {
                if (response.currentArea.state == '1') {
                    var areaOne = [], areaOneSalesSum = [],
                        areaTwo = [], areaTwoSalesSum = [],
                        areaThree = [], areaThreeSalesSum = [],
                        areaFour = [], areaFourSalesSum = [];
                    var currentAreaData = response.currentArea.data;

                    if (currentAreaData.length >= 5) {
                        areaLength = 4;
                    } else {
                        areaLength = currentAreaData.length;
                    }
                    if (currentAreaData[0]) {
                        //类型一
                        currentAreaData[0].cityData.forEach(function (item, index) {
                            areaOne.push(item.city);
                            areaOneSalesSum.push(item.sum);
                        });
                        tagOneArea.hideLoading();
                        tagOneArea.setOption({
                            title: {
                                text: currentAreaData[0].className
                            },
                            xAxis: {
                                data: areaOne
                            },
                            series: [
                                {
                                    name: "月销售数量",
                                    data: areaOneSalesSum
                                }
                            ]
                        });
                    }
                    if (currentAreaData[1]) {
                        //类型二
                        currentAreaData[1].cityData.forEach(function (item, index) {
                            areaTwo.push(item.city);
                            areaTwoSalesSum.push(item.sum);
                        });
                        tagTwoArea.setOption({
                            title: {
                                text: currentAreaData[1].className
                            },
                            xAxis: {
                                data: areaTwo
                            },
                            series: [
                                {
                                    name: "月销售数量",
                                    data: areaTwoSalesSum
                                }
                            ]
                        });
                    }
                    if (currentAreaData[2]) {
                        //类型三
                        currentAreaData[2].cityData.forEach(function (item, index) {
                            areaThree.push(item.city);
                            areaThreeSalesSum.push(item.sum);
                        });
                        tagThreeArea.setOption({
                            title: {
                                text: currentAreaData[2].className
                            },
                            xAxis: {
                                data: areaThree
                            },
                            series: [
                                {
                                    name: "月销售数量",
                                    data: areaThreeSalesSum
                                }
                            ]
                        });
                    }
                    if (currentAreaData[3]) {
                        //类型四
                        currentAreaData[3].cityData.forEach(function (item, index) {
                            areaFour.push(item.city);
                            areaFourSalesSum.push(item.sum);
                        });
                        tagFourArea.setOption({
                            title: {
                                text: currentAreaData[3].className
                            },
                            xAxis: {
                                data: areaFour
                            },
                            series: [
                                {
                                    name: "月销售数量",
                                    data: areaFourSalesSum
                                }
                            ]
                        });
                    }
                }
            }
        });
    }
    getAreaSales();
    setInterval(function () {
        getAreaSales();
    }, 20 * 1000);

    //轮播
    function scrollTag() {
        var ind = 0, index2 = 0;
        var tagbox = $('.tagbox');
        //第二屏中间轮播
        var brandbox = $('.brandbox');
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //右侧轮播滚动高度
        var scrollHeight = (clientHeight - 60) / 2;
        console.log('第二屏右下滚动高度' + scrollHeight);
        //中间轮播滚动高度
        var cheight = (clientHeight - 60) * 0.333333333;

        //品牌销售轮播
        setInterval(function () {
            index2++;
            brandbox.css({
                'transition': 'all 2s',
                'margin-top': - cheight * index2 + 'px'
            });
            if (index2 == 2) {
                index2 = 0;
                brandbox.css({
                    'transition': 'none',
                    'margin-top': 0 + 'px'
                });
            }
        }, 5 * 1000);
        //地区销售滚动
        setInterval(function () {
            ind++;
            tagbox.css({
                'transition': 'all 2s',
                'margin-top': - scrollHeight * ind + 'px'
            });
            if (ind == areaLength) {
                ind = 0;
                tagbox.css({
                    'transition': 'none',
                    'margin-top': 0 + 'px'
                });
            }
        }, 5 * 1000);
    }
    scrollTag();
});