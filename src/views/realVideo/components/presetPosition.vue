<template>
    <div class="presetPosition">
        <div class="iconBox" title="预置位" @click="switchWhetherToExpand">
            <el-icon size="18" color="#fff" :class="{ rotate: state.whetherToExpand }"><ele-ArrowRightBold /></el-icon>
        </div>


        <div class="contentBox" :class="{ open: state.whetherToExpand }">
            <div class="funBox">
                <el-icon size="20" @click="state.outerVisible = true"><ele-CirclePlusFilled /></el-icon>
            </div>
            <div class="content">
                <ul class="ul example1" ref="ulBoxDom">
                    <li v-for="num in 20" class="item" :key="num" :draggable="false">
                        <span class="title">预置位{{ num }}</span>
                        <el-text size="small" type="danger" style="cursor: pointer; margin-right: 10px;"
                            @click="deleteItem(num)">删除</el-text>
                    </li>
                </ul>
            </div>
        </div>


        <teleport to="#app">

            <el-dialog v-model="state.outerVisible" title="添加预置位" width="400">

                <el-form ref="ruleFormRef" style="max-width: 300px" :model="ruleForm" :rules="rules" label-width="auto"
                    class="demo-ruleForm" :size="'default'" status-icon>
                    <el-form-item label="预置位名称" prop="name">
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">

                        <el-button type="primary" @click="submitForm">
                            确定
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </teleport>

    </div>
</template>



<script>
import { defineAsyncComponent, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
import Sortable from 'sortablejs';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
    setup(props, { emit }) {
        const state = reactive({
            whetherToExpand: false,

            sortable: null
        });

        const ruleForm = reactive({
            name: ''
        });

        const rules = reactive({
            name: [
                { required: true, message: '名称不能为空', trigger: 'blur' },
            ],
        });

        const ulBoxDom = ref(null);

        const ruleFormRef = ref(null);

        function switchWhetherToExpand() {
            state.whetherToExpand = !state.whetherToExpand;
        };

        function initSortable() {
            state.sortable && state.sortable.destroy();

            state.sortable = new Sortable(ulBoxDom.value, {
                animation: 350,
                ghostClass: 'blue-background-class',
                onUpdate: (event) => {
                    console.log(event.oldIndex, event.newIndex)
                }
            });
        };




        onMounted(() => {

            initSortable();


        });


        // 删除
        async function deleteItem(name) {
            await ElMessageBox.confirm(
                `是否确定删除 ${name}?`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            );
            console.log('==')
        };

        async function submitForm() {
            await ruleFormRef.value.validate();

            console.log('=====')
        }


        return {
            state,
            switchWhetherToExpand,
            ulBoxDom,
            deleteItem,
            ruleForm,
            rules,
            ruleFormRef,
            submitForm
        };
    }
}
</script>


<style lang="scss" scoped>
.presetPosition {
    .iconBox {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        transition: all 0.4s;
        background-color: #afafaf;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        top: 10%;
        right: 10px;
        opacity: 0.5;

        &:hover {
            opacity: 1;
        }


        .el-icon {
            transition: all 0.4s;
            transform: rotate(0deg);


            &.rotate {
                transform: rotate(90deg);
            }
        }

    }


    .contentBox {
        width: 200px;
        height: 70vh;
        position: fixed;
        top: 16%;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0px 0px 6px #ccc;
        right: -200px;
        border-radius: 15px;
        transition: all 0.5s;
        padding: 10px 0px;

        &.open {
            right: 8px;
        }


        .funBox {
            display: flex;
            justify-content: end;
            padding: 0px 10px;

            .el-icon {
                cursor: pointer;
                transition: all 0.3s;
                transform: scale(1);

                &:hover {
                    transform: scale(1.2);
                }
            }
        }


        .content {
            height: 62vh;
            width: 100%;
            margin-top: 18px;
            overflow: auto;

            .ul {
                .item {
                    padding: 7px 10px;
                    list-style: none;
                    cursor: pointer;
                    display: flex;
                    align-content: center;
                    justify-content: space-between;

                    &.blue-background-class {
                        opacity: 0.5;
                        background-color: #c8ebfb;
                    }

                    .title {
                        font-size: 14px;
                        color: #333;

                    }

                    &:hover {}
                }
            }
        }

    }
}
</style>

<style lang="scss">
.el-dialog__title {
    color: #fff;
}
</style>