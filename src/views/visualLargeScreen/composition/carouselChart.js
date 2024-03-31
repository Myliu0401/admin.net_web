import { ref, } from 'vue';



export default () => {

    const chart = ref(null); // 轮播图实例

    // 初始化轮播图
    function initCarouselChart() {
        chart.value = new Swiper('.swiper', {
            direction: 'horizontal', // 垂直切换选项
            loop: true, // 循环模式选项
            slidesPerView: 2, // 设置slider容器能够同时显示的slides数量(carousel模式)。
            slidesPerGroup: 1, // 设置slides的数量多少为一组。
            spaceBetween: 10, // 在slide之间设置距离（单位px）。
            /* navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }, */
        });

    };

    // 切换轮播图
    function switchingTheCarouselChart(type) {
        type === 'prev' ? chart.value.slidePrev() : chart.value.slideNext();
    };

    return {
        chart,
        initCarouselChart,
        switchingTheCarouselChart
    }


};