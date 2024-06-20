<template>
	<el-dialog title="参数管理" v-model="state.show" :close-on-click-modal="false" width="60%" :before-close="close">
		<el-tabs v-model="state.type" class="demo-tabs" @tab-change="handleClick">
			<el-tab-pane label="关键帧与重启" name="KeyframesAndRestarts">
                <KeyframesAndRestarts :deviceID="state.deviceID" v-if="state.type === 'KeyframesAndRestarts'"/>
            </el-tab-pane>
			<el-tab-pane label="录像" name="videotape">
                <Videotape :deviceID="state.deviceID" v-if="state.type === 'videotape'"/>
            </el-tab-pane>
		</el-tabs>
	</el-dialog>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import KeyframesAndRestarts from './KeyframesAndRestarts.vue';
import Videotape from './Videotape.vue';



export default {

    components: { KeyframesAndRestarts, Videotape },

	setup(props, { emit }) {
		const state = reactive({
			show: false,
            type: 'KeyframesAndRestarts',
            deviceID: null
		});

		// 关闭弹窗
		function close() {
			state.show = false;
		}

		// 打开弹窗
		function open(item) {
			state.show = true;
            state.deviceID = item.id;
		};


        // 切换类型
        function handleClick(e){
           
        }

		return { state, open, handleClick, close };
	},
};
</script>


<style lang="scss" scoped>
</style>


<style lang="scss">
.tabsContent{
    
}
.el-tabs__content{
    height: 60vh;

    .el-tab-pane{
        height: 100%;
    }
}
</style>

