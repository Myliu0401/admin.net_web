import { ref, onMounted } from 'vue';



export default function () {
   const innerRadius = ref(0);
   const outerRadius = ref(0);

   // 渲染环形饼图
   function renderRateRingChart(dom, datas = []) {

      const myChart = window.echarts.init(dom);
      const option = {
         legend: {
            right: '5%', // 图例放置在右边
            top: 'center', // 垂直居中
            orient: 'vertical', // 设置图例纵向排列
            icon: 'circle',
            textStyle: {
               color: '#C5FFFE', // 设置字体颜色
            },
         },

         series: [
            {
               name: 'Access From',
               type: 'pie',
               radius: ['40%', '58%'],
               center: ['35%', '50%'],
               avoidLabelOverlap: false,
               itemStyle: {
                  borderRadius: 20,

                  borderWidth: 2,
               },

               labelLine: {
                  show: false,
               },
               data: datas,
               label: {
                  show: false,
                  position: 'center',
                  fontSize: 12,
                  formatter: function (params) {
                     return `${params.percent}%\n\n${params.name}`;
                  },
               },
               emphasis: {
                  label: {
                     show: true,
                     fontSize: 16,
                     fontWeight: 'bold',
                     color: '#C5FFFE',
                  },
               },
            },
         ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      const width = myChart.getWidth();
      const height = myChart.getHeight();

      // 计算矩形较小边长作为圆的直径
      const diameter = Math.min(width, height);

      // 计算内外半径
      innerRadius.value = diameter * 0.4 - 7;
      outerRadius.value = diameter * 0.58 + 12;
   };


   return {
      innerRadius,
      outerRadius,
      renderRateRingChart
   }
};