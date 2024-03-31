import { reactive, ref, onBeforeMount } from 'vue';



export default function () {


    const inLineeQuipment = ref(200);
    const offLineEquipment = ref(100);
    const faultyEquipment = ref(170);


    // 渲染设备状态柱状图
    function renderDeviceStatu(datas = {}, dom) {
        const myChart = window.echarts.init(dom);

        // 标题转换
        const titleConversion = {
            inLineeQuipment: '在线设备',
            offLineEquipment: '离线设备',
            faultyEquipment: '故障设备',
        };

        const obj = {};
        Object.keys(datas).map((name) => {
            return (obj[titleConversion[name]] = datas[name]);
        });

        let barWidth = 800 / 30;
        const option = {
            grid: {
                height: '60%',
                bottom: '15%',
            },

            xAxis: {
                data: Object.keys(obj), // x 轴数据

                axisTick: {
                    // 设置 x 轴的刻度线
                    show: false, // 不显示刻度线
                },

                axisLine: {
                    // 设置 x 轴线的样式
                    lineStyle: {
                        color: '#C5FFFE', // 设置 x 轴线的颜色
                    },
                },

                axisLabel: {
                    margin: 20, // 设置标题与坐标轴之间的间距
                },
            },
            yAxis: {
                splitLine: {
                    // 设置 y 轴的分割线
                    show: true,
                    lineStyle: {
                        type: 'dashed', // 设置虚线样式
                        color: '#C5FFFE', // 设置虚线颜色
                        length: 17,
                    },
                },

                axisLabel: {
                    // 设置 y 轴刻度标签样式
                    textStyle: {
                        color: '#C5FFFE', // 设置刻度标签文本颜色
                    },
                },
            },

            series: [
                {
                    type: 'bar',
                    barWidth: barWidth,
                    z: 1,
                    data: createColumnColors(Object.values(obj)),
                    label: {
                        show: true, // 显示数值
                        position: 'top', // 数值显示在顶部
                        color: '#C5FFFE', // 字体颜色
                        fontSize: 12, // 字体大小
                        offset: [0, -5], // 位置调整
                    },
                },
                {
                    z: 3,
                    type: 'pictorialBar',
                    symbolPosition: 'start',
                    data: createTopCoverColor(Object.values(obj)),
                    symbol: 'diamond',
                    symbolOffset: [0, '55%'],
                    symbolSize: [barWidth, barWidth * 0.5],
                    silent: true,
                },
                {
                    z: 3,
                    type: 'pictorialBar',
                    symbolPosition: 'end',
                    data: createBottomCoverColor(Object.values(obj)),
                    symbol: 'diamond',
                    symbolOffset: [0, '-55%'],
                    symbolSize: [barWidth, barWidth * 0.5],
                    silent: true,
                },
            ],

            dataZoom: [
                {
                    type: 'inside', // 内置的数据区域缩放组件
                    start: 0, // 起始位置百分比
                    end: 100, // 结束位置百分比
                    minValueSpan: 1, // 缩放的最小值区间
                },
            ],
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    };

    // 创建柱子颜色
    function createColumnColors(datas = []) {
        return datas.map((value) => {
            return {
                value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        1,
                        0,
                        0,
                        [
                            {
                                offset: 0,
                                color: 'rgba(0, 132, 255, 0.8)', // 0% 处的颜色
                            },
                            {
                                offset: 0.6,
                                color: 'rgba(99, 235, 233, 0.8)', // 60% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(99, 235, 233, 0.8)', // 100% 处的颜色
                            },
                        ],
                        false
                    ),
                },
            };
        });
    };

    // 创建顶部盖子颜色
    function createTopCoverColor(datas = []) {
        return datas.map((value) => {
            return {
                value,
                itemStyle: {
                    color: '#0084FF',
                },
            };
        });
    };

    // 创建底部盖子颜色
    function createBottomCoverColor(datas = []) {
        return datas.map((value) => {
            return {
                value,
                itemStyle: {
                    color: '#63EBE9',
                    borderWidth: 1,
                    borderColor: '#63EBE9',
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 1,
                },
            };
        });
    };


    // 挂载前执行
    onBeforeMount(() => {

    });

    return {
        inLineeQuipment,
        offLineEquipment,
        faultyEquipment,
        renderDeviceStatu,
        createColumnColors,
        createTopCoverColor,
        createBottomCoverColor
    }
};






