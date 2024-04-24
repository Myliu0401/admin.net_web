<template>
	<el-dialog title="添加塔杆" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%" :before-close="handleClose">
		<el-form v-loading="state.loading" ref="ruleFormRef" :model="form" :rules="rules" label-width="70px">
			<el-form-item label="塔杆名称" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>

			<el-form-item label="备注">
				<el-input v-model="form.remark" />
			</el-form-item>

			<el-form-item label="排序">
				<el-input v-model="form.orderNo" type="number" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="通用状态">
				<el-switch inline-prompt active-text="启用" inactive-text="禁用" v-model="form.status" />
			</el-form-item>

			<el-form-item label="直属线路" prop="lineId">
				<el-select v-model="form.lineId" clearable placeholder="直属线路" size="small" style="width: 150px; min-width: 150px; margin-right: 10px">
					<el-option v-for="item in railLines" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="经纬度">
				<div class="jinweidu">
					<span class="text">经度: {{ form.longitude }}</span>
					<span class="text">纬度：{{ form.latitude }}</span>

					<el-input v-model="state.keyword" style="width: 100px" placeholder="位置" clearable />
					<el-button type="primary" @click="search">搜索</el-button>
				</div>
				<div class="baidumap" id="baidumap"></div>
			</el-form-item>

			<el-form-item class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>


<script >
import { defineProps, reactive, defineComponent, ref, defineEmits, onMounted } from 'vue';
import { addToerPoles } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { conforms } from 'lodash-es';
export default defineComponent({
	props: {
		railLines: {
			default() {
				return [];
			},
		},
	},
	setup(props, { emit }) {
		const ruleFormRef = ref(null);

		const state = reactive({
			dialogVisible: false,
			loading: false,
			keyword: undefined,
			mapExample: null
		});

		const form = reactive({
			name: undefined, // 塔杆名称
			status: false, // 通用状态
			remark: undefined, // 备注
			orderNo: undefined, // 排序
			lineId: undefined,
			longitude: undefined,
			latitude: undefined,
		});

		const rules = reactive({
			name: [{ required: true, message: '必须输入塔杆名称', trigger: 'blur' }],
			lineId: [{ required: true, message: '必须选择线路', trigger: 'blur' }],
		});

		// 开启弹窗
		function open() {
			state.dialogVisible = true;
			setTimeout(initBaiduMap, 200);
		};

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
		};

		async function submitForm(ruleFormRef) {
			const res = await ruleFormRef.validate();
			if (!res) {
				return;
			}

			this.loading = true;
			await addToerPoles({
				name: form.name,
				orderNo: form.orderNo,
				remark: form.remark,
				status: form.status ? 1 : 2,
				lineId: form.lineId,
				longitude: +form.longitude,
				latitude: +form.latitude
			});
			this.loading = false;
			emit('complete');
			close();
			ElMessage({
				message: `添加塔杆 ${form.name}，成功`,
				type: 'success',
			});
		};

		// 初始化百度地图
		function initBaiduMap() {
			state.mapExample = new BMapGL.Map('baidumap'); // "mapContainer" 是你地图容器的 ID
			state.mapExample.enableScrollWheelZoom(true);
			const point = new BMapGL.Point(116.404, 39.925); // 地图中心点
			state.mapExample.centerAndZoom(point, 15); // 创建地图并设置中心点

			state.mapExample.addEventListener('click', (e) => {
				state.mapExample.clearOverlays(); // 清除地图上的所有覆盖物
				form.longitude = e.latlng.lng.toFixed(5);
				form.latitude = e.latlng.lat.toFixed(5);
				var point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
				var marker = new BMapGL.Marker(point); // 创建标注
				state.mapExample.addOverlay(marker); // 将标注添加到地图中
			});
		};

		// 搜索地区
		function search(){
			var local = new BMapGL.LocalSearch(state.mapExample, {
				renderOptions: { map: state.mapExample },
			});
			local.search(state.keyword);
		};

		return { state, open, close, form, rules, submitForm, ruleFormRef, search };
	},
});
</script>

<style lang="scss" scoped>
.dialog-footer {
	margin-top: 20px;
	text-align: end;
}

.jinweidu {
	margin-bottom: 5px;
	.text {
		display: inline-block;
		width: 100px;
	}
}

.baidumap {
	width: 100%;
	height: 300px;
}
</style>