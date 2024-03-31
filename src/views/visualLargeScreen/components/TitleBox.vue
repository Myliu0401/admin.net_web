<template>
    <div class="titleBox">
        <div class="titleBox_button">
            <span class="arrow"></span>
            <span class="arrow"></span>
        </div>
        <p class="titleBox_title">基础信息</p>
        <div class="titleBox_button">
            <span class="arrow"></span>
            <span class="arrow"></span>
        </div>
    </div>
</template>



<script setup name="titleBox">

</script>


<style lang="scss" scoped>
.titleBox {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 40px;
    background: linear-gradient(270deg,
            rgba(99, 235, 255, 0) 0%,
            rgba(99, 235, 233, 0.5) 34.74%,
            rgba(14, 179, 255, 0.5) 68.86%,
            rgba(27, 38, 174, 0) 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 13px;
    z-index: 1;

    .titleBox_button {
        display: flex;
        cursor: pointer;
        min-width: 50px;

        .arrow {
            display: inline-block;

            width: 15px;
            height: 13.19px;
            opacity: 1;
            transform: rotate(90deg);
            background: url(https://img.js.design/assets/img/65f7d9a958ddb4de45a63d06.png);
            background-size: 100%;
        }

        &:hover {
            .arrow {
                width: 16px;
                height: 14.19px;
            }
        }
    }

    .titleBox_button:last-child {
        .arrow {
            transform: rotate(270deg);
        }
    }

    .titleBox_title {
        font-size: 14px;
        color: #fff;
    }
}
</style>
