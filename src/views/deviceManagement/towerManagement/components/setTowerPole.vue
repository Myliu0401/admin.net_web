<template>
	<el-dialog title="修改塔杆" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%"
		:before-close="handleClose">
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

			<el-form-item label="材质">
				<el-input v-model="form.material" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="性质">
				<el-input v-model="form.property" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="通用状态">
				<el-switch inline-prompt active-text="启用" inactive-text="禁用" v-model="form.status" />
			</el-form-item>

			<el-form-item label="直属线路" prop="lineId">
				<el-select v-model="form.xinzheng.provinceId" placeholder="省" size="small"
					style="width: 100px !important; margin-right: 10px; margin-bottom: 5px;"
					@change="myGetRegionList('省', $event)">
					<el-option v-for="item in stateData.province" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<el-select v-model="form.xinzheng.cityId" placeholder="市" size="small"
					style="width: 100px !important; margin-right: 10px; margin-bottom: 5px;"
					@change="myGetRegionList('市', $event)">
					<el-option v-for="item in stateData.city[form.xinzheng.provinceId]" :key="item.id"
						:label="item.name" :value="item.id" />
				</el-select>

				<el-select v-model="form.xinzheng.areaId" placeholder="区" size="small"
					style="width: 100px !important; margin-right: 10px; margin-bottom: 5px;"
					@change="myGetRegionList('区', $event)">
					<el-option v-for="item in stateData.area[form.xinzheng.cityId]" :key="item.id" :label="item.name"
						:value="item.id" />
				</el-select>

				<el-select v-model="form.xinzheng.gradeId" placeholder="等级" size="small"
					style="width: 100px !important; margin-right: 10px; margin-bottom: 5px;"
					@change="myGetRailLine($event)">
					<el-option v-for="item in stateData.grade" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<el-select v-model="form.xinzheng.lineId" placeholder="线路" size="small"
					style="width: 100px !important; margin-right: 10px; margin-bottom: 5px;">
					<el-option v-for="item in stateData.line[form.xinzheng.gradeId]" :key="item.id" :label="item.name"
						:value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item label="经纬度">
				<div class="jinweidu">
					<span class="text">经度: {{ form.longitude }}</span>
					<span class="text">纬度：{{ form.latitude }}</span>

					<el-input v-model="state.keyword" style="width: 100px" placeholder="位置" clearable />
					<el-button type="primary" @click="search">搜索</el-button>
				</div>
				<div class="baidumap" id="baidumap1"></div>
			</el-form-item>

			<el-form-item class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>


<script>
import { defineProps, reactive, defineComponent, ref, defineEmits } from 'vue';
import { updateTowerPoles, getRegionList, getVoltageLevel, getRailLine, } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getRegion, getSuperiorData } from '/@/api/visualLargeScreen/index.js';


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
			id: null,
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
			material: undefined, // 材质
			property: undefined, // 性质
			xinzheng: {
				provinceId: null,  // 省
				cityId: null,  // 市
				areaId: null,  // 区
				gradeId: null, // 等级
				lineId: null, // 线路
			}
		});

		const rules = reactive({
			name: [{ required: true, message: '必须输入塔杆名称', trigger: 'blur' }],
			lineId: [{ required: true, message: '必须选择线路', trigger: 'blur' }],
		});

		const stateData = reactive({
			province: [],
			city: {

			},
			area: {

			},
			grade: [], // 等级
			line: { // 线路

			},
		});


		// 获取所有省份
		async function myGetRegion() {
			const res = await getRegion(0);
			stateData.province = res.data.result;
		};

		// 获取省以下级别
		async function myGetRegionList(type, pid, index) {
			if (type === '省' && stateData.city[pid] || type === '市' && stateData.area[pid]) {
				return
			}
			if (type === '区') {
				myGetVoltageLevel(index);
				return
			}
			const res = await getRegionList({
				page: 1,
				pageSize: 10000,
				pid,
			});


			if (type === '省' && !stateData.city[pid]) {

				stateData.city[pid] = res.data.result.items;

				form.xinzheng.cityId = null;

			} else if (type === '市' && !stateData.area[pid]) {
				stateData.area[pid] = res.data.result.items;

			}

			form.xinzheng.areaId = null;
			form.xinzheng.gradeId = null;
			form.xinzheng.lineId = null;
		};

		// 获取等级列表
		async function myGetVoltageLevel(index) {
			const res = await getVoltageLevel();
			stateData.grade = res.data.result;
			form.xinzheng.lineId = null;
		};


		// 获取线路
		async function myGetRailLine(id, index) {
			const res = await getRailLine({
				countyId: form.xinzheng.areaId, // 区县id
				voltageLevelId: id, // 电压等级
			});
			stateData.line[id] = res.data.result;

		};

		async function myGetSuperiorData(data = {}) {
			const res = await getSuperiorData(data);
			return res.data.result;
		}

		// 打开弹窗
		async function open(item) {
			state.dialogVisible = true;
			state.id = item.id;
			form.name = item.name;
			form.remark = item.remark;
			form.orderNo = item.orderNo;
			form.status = item.status == 1 ? true : false;
			form.lineId = item.lineId;
			form.longitude = item.longitude;
			form.latitude = item.latitude;
			form.material = item.material// 材质
			form.property = item.property// 性质

			setTimeout(initBaiduMap, 200);

			await myGetRegion();

			const res = await myGetSuperiorData({
				type: 2,
				id: form.lineId
			});

			form.xinzheng.provinceId = res[4].id;
			await myGetRegionList('省', form.xinzheng.provinceId);
			form.xinzheng.cityId = res[3].id;
			await myGetRegionList('市', form.xinzheng.cityId);
			form.xinzheng.areaId = res[2].id;
			await myGetRegionList('区', form.xinzheng.areaId);
			form.xinzheng.gradeId = res[1].id;
			form.xinzheng.lineId = res[0].id;
			await myGetRailLine(form.xinzheng.gradeId);
			form.xinzheng.lineId = res[0].id;
		
		};



		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
			wipeData();
		};

		// 修改塔杆
		async function submitForm(ruleFormRef) {
			form.xinzheng.lineId && (form.lineId = form.xinzheng.lineId)
			const bool = await ruleFormRef.validate();
			if (!bool) {
				return;
			};
			this.loading = true;
			const res = await updateTowerPoles({
				id: state.id,
				name: form.name,
				orderNo: form.orderNo,
				remark: form.remark,
				status: form.status ? 1 : 2,
				lineId: form.lineId,
				longitude: +form.longitude * 1000000,
				latitude: +form.latitude * 1000000,
				material: form.material,
				property: form.property
			});
			this.loading = false;
			close();
			emit('complete');
			ElMessage({
				message: `塔杆更新成功`,
				type: 'success',
			});



		};


		// 初始化百度地图
		function initBaiduMap() {
			state.mapExample = new BMapGL.Map('baidumap1'); // "mapContainer" 是你地图容器的 ID
			state.mapExample.enableScrollWheelZoom(true);
			const point = new BMapGL.Point(form.longitude || 116.404, form.latitude || 39.925); // 地图中心点
			state.mapExample.centerAndZoom(point, 15); // 创建地图并设置中心点


			if (form.longitude && form.latitude) {
				var point1 = new BMapGL.Point(form.longitude, form.latitude);
				var marker = new BMapGL.Marker(point1); // 创建标注
				state.mapExample.addOverlay(marker); // 将标注添加到地图中
			}


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
		function search() {
			var local = new BMapGL.LocalSearch(state.mapExample, {
				renderOptions: { map: state.mapExample },
			});
			local.search(state.keyword);
		};


		function wipeData() {
			state.dialogVisible = false;
			state.loading = false;
			state.keyword = undefined;
			state.mapExample = null;

			form.name = undefined;
			form.status = false;
			form.remark = undefined;
			form.orderNo = undefined;
			form.lineId = undefined;
			form.longitude = undefined;
			form.latitude = undefined;
			form.material = undefined;
			form.property = undefined;
		}

		return {
			state,
			open,
			close,
			form,
			rules,
			submitForm,
			ruleFormRef,
			search,
			stateData,
			myGetRegionList,
			myGetRailLine
		};
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