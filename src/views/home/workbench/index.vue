<template>
    <div class="workbench">
        <div class="workbench_titleBox">
            <h1 class="title">可视化大屏</h1>

            <div class="arrows" @click="enterTheLargeScreen">
                <img class="arrow" src="../../../assets/img/right.png"></img>
                <img class="arrow" src="../../../assets/img/right.png"></img>
            </div>
        </div>

        <div class="items" v-for="num in 2" :key="num">
            <h4 class="title">设备数据</h4>
            <ul class="content">
                <li class="content_li">
                    <div class="li_left">
                        <img class="li_img" src="../../../assets/img/1.png" />
                    </div>

                    <div class="li_div">
                        <span class="num">88</span>
                        <span class="text">设备总数</span>
                    </div>
                </li>

                <li class="content_li">
                    <div class="li_left">
                        <img class="li_img" src="../../../assets/img/2.png" />
                    </div>

                    <div class="li_div">
                        <span class="num">88</span>
                        <span class="text">设备总数</span>
                    </div>
                </li>

                <li class="content_li">
                    <div class="li_left">
                        <img class="li_img" src="../../../assets/img/3.png" />
                    </div>

                    <div class="li_div">
                        <span class="num">88</span>
                        <span class="text">设备总数</span>
                    </div>
                </li>

                <li class="content_li">
                    <div class="li_left">
                        <img class="li_img" src="../../../assets/img/4.png" />
                    </div>

                    <div class="li_div">
                        <span class="num">88</span>
                        <span class="text">设备总数</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


<script setup name="workbench">
import { useRouter } from 'vue-router';
const router = useRouter();

// 进入大屏
const enterTheLargeScreen = ()=>{
    router.replace('/visualLargeScreen');
}; 

</script>


<style lang="scss" scoped>
.workbench {

    padding: 0px 15px;

    .workbench_titleBox {
        width: 100%;
        height: 95px;
        background-color: #fff;
        box-shadow: 1px 1px 4px 1px rgba(221, 221, 221, 1);
        border-radius: 10px;
        background-image: url(src/assets/img/titleback.png);
        background-repeat: no-repeat;
        background-size: 60% 110%;
        background-position-x: center;
        background-position-y: -11px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .title {
            color: rgba(99, 235, 233, 1);
            font-size: 35px;
            font-weight: normal;
            letter-spacing: 9px;
        }

        .arrows {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            right: 3%;
            cursor: pointer;

            &:hover {
                .arrow {
                    height: 42px;
                }
            }

            .arrow {
                height: 40px;
                transition: all 0.3s;

                &:first-child {
                    position: relative;
                    left: 20px;
                }
            }
        }
    }


    .items {
        .title {
            color: rgba(51, 51, 51, 1);
            font-size: 13px;
            font-weight: normal;
            margin: 10px 0px;
        }

        .content {
            display: flex;
            justify-content: space-between;
            padding: 0px 4px;

            .content_li {
                display: flex;
                align-items: center;
                width: 23%;
                height: 15vh;
                background-color: #fff;
                border-radius: 6px;
                box-shadow: 1px 1px 4px 1px rgba(221, 221, 221, 1);

                .li_left {
                    width: 50%;
                    display: flex;
                    justify-content: center;
                }

                .li_img {
                    height: 65px;
                }

                .li_div {
                    display: flex;
                    flex-direction: column;
                    width: 50%;
                    justify-content: center;
                    align-items: center;

                    .num {
                        font-size: 28px;
                        font-weight: 500;
                        color: rgba(51, 51, 51, 1);
                    }

                    .text {
                        color: rgba(51, 51, 51, 1);
                        font-size: 14px;
                        margin-top: 7px;
                    }
                }
            }
        }
    }
}
</style>