<template>
	<el-dialog title="参数配置" v-model="state.show" :close-on-click-modal="false" width="60%" :before-close="close">
		<el-tabs v-model="state.type" class="demo-tabs" @tab-change="handleClick">
			<el-tab-pane label="基本操作" name="basicOperation">
                <BasicOperation :deviceID="state.deviceID" v-if="state.type === 'basicOperation'"/>
            </el-tab-pane>
			<el-tab-pane label="主站ip" name="masterStation">
                <MasterStation :deviceID="state.deviceID" v-if="state.type === 'masterStation'"/>
            </el-tab-pane>
			<el-tab-pane label="装置配置" name="deviceConfig">
                <DeviceConfig :deviceID="state.deviceID" v-if="state.type === 'deviceConfig'"/>
            </el-tab-pane>
			<el-tab-pane label="短信" name="message">
                <Message :deviceID="state.deviceID" v-if="state.type === 'message'"/>
            </el-tab-pane>

            <el-tab-pane label="主站装置" name="mainStationDevice">Task</el-tab-pane>

            <el-tab-pane label="拍照时间表" name="photographySchedule">
                <PhotographySchedule :deviceID="state.deviceID" v-if="state.type === 'photographySchedule'"/>
            </el-tab-pane>
            <el-tab-pane label="主站下发参数" name="MainStationIssuesPara">
                <MainStationIssuesPara :deviceID="state.deviceID" v-if="state.type === 'MainStationIssuesPara'"/>
            </el-tab-pane>
            <el-tab-pane label="主站装置文件列表" name="MainStationDeviceFileList">
                <MainStationDeviceFileList :deviceID="state.deviceID" v-if="state.type === 'MainStationDeviceFileList'"/>
            </el-tab-pane>
            <el-tab-pane label="短视频" name="ShortVideo">
                <ShortVideo :deviceID="state.deviceID" v-if="state.type === 'ShortVideo'"/>
            </el-tab-pane>
            <el-tab-pane label="视频采集" name="VideoCapture">
                <VideoCapture :deviceID="state.deviceID" v-if="state.type === 'VideoCapture'"/>
            </el-tab-pane>
            <el-tab-pane label="OSD" name="OSD">
                <OSD :deviceID="state.deviceID" v-if="state.type === 'OSD'"></OSD>
            </el-tab-pane>
            <el-tab-pane label="录像" name="Videotape">
                <Videotape :deviceID="state.deviceID" v-if="state.type === 'Videotape'"></Videotape>
            </el-tab-pane>

            <el-tab-pane label="摄像机" name="Camera">
                <Camera :deviceID="state.deviceID" v-if="state.type === 'Camera'"></Camera>
            </el-tab-pane>

            <el-tab-pane label="智能" name="Intelligent">
                <Intelligent :deviceID="state.deviceID" v-if="state.type === 'Intelligent'"></Intelligent>
            </el-tab-pane>

            <el-tab-pane label="联动" name="Linkage">
                <Linkage :deviceID="state.deviceID" v-if="state.type === 'Linkage'"></Linkage>
            </el-tab-pane>

            <el-tab-pane label="图像采集" name="ImageAcquisition">
                <ImageAcquisition :deviceID="state.deviceID" v-if="state.type === 'ImageAcquisition'"></ImageAcquisition>
            </el-tab-pane>
		</el-tabs>
	</el-dialog>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import BasicOperation from './BasicOperation.vue';
import MasterStation from './MasterStation.vue';
import DeviceConfig from './DeviceConfig.vue';
import Message from './Message.vue';
import PhotographySchedule from './PhotographySchedule.vue';
import MainStationIssuesPara from './MainStationIssuesPara.vue';
import MainStationDeviceFileList from './MainStationDeviceFileList.vue';
import ShortVideo from './ShortVideo.vue';
import VideoCapture from './VideoCapture.vue';
import OSD from './OSD.vue';
import Videotape from './Videotape.vue';
import Camera from './Camera.vue';
import Intelligent from './Intelligent.vue';
import Linkage from './Linkage.vue';
import ImageAcquisition from './ImageAcquisition.vue';


export default {

    components: { BasicOperation, MasterStation, DeviceConfig, Message, PhotographySchedule, MainStationIssuesPara, MainStationDeviceFileList, ShortVideo, VideoCapture, OSD, Videotape, Camera, Intelligent, Linkage, ImageAcquisition },

	setup(props, { emit }) {
		const state = reactive({
			show: false,
            type: 'basicOperation',
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
            console.log(e)
        }

		return { state, open, handleClick };
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

