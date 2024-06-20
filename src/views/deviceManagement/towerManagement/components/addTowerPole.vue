<template>
	<el-dialog
		title="添加塔杆"
		v-model="state.dialogVisible"
		:close-on-click-modal="false"
		width="50%"
		:before-close="handleClose"
	>
		<el-form v-loading="state.loading" ref="ruleFormRef" label-width="70px">
			<div class="mainContent">
				<div v-for="(item, index) in form" :key="index" class="itemBox">
					<el-form-item label="塔杆名称" class="formItem">
						<el-input v-model="item.name" style="width: 150px" />
					</el-form-item>

					<el-form-item label="备注" class="formItem">
						<el-input v-model="item.remark" style="width: 350px" />
					</el-form-item>

					<el-form-item label="排序" class="formItem">
						<el-input v-model="item.orderNo" type="number" style="width: 70px" min="1" />
					</el-form-item>

					<el-form-item label="材质" class="formItem">
						<el-input v-model="item.material" style="width: 150px" min="1" />
					</el-form-item>

					<el-form-item label="性质" class="formItem">
						<el-input v-model="item.property" style="width: 150px" min="1" />
					</el-form-item>

					<el-form-item label="是否启用" class="formItem">
						<el-switch
							inline-prompt
							active-text="启用"
							inactive-text="禁用"
							v-model="item.status"
						/>
					</el-form-item>

					<el-form-item label="直属线路" class="formItem">
						<el-select
							v-model="item.xinzheng.provinceId"
							placeholder="省"
							size="small"
							style="width: 100px !important; margin-right: 10px; margin-bottom: 5px"
							@change="myGetRegionList('省', $event, index)"
						>
							<el-option
								v-for="item1 in stateData.province"
								:key="item1.id"
								:label="item1.name"
								:value="item1.id"
							/>
						</el-select>

						<el-select
							v-model="item.xinzheng.cityId"
							placeholder="市"
							size="small"
							style="width: 100px !important; margin-right: 10px; margin-bottom: 5px"
							@change="myGetRegionList('市', $event, index)"
						>
							<el-option
								v-for="item1 in stateData.city[item.xinzheng.provinceId]"
								:key="item1.id"
								:label="item1.name"
								:value="item1.id"
							/>
						</el-select>

						<el-select
							v-model="item.xinzheng.areaId"
							placeholder="区"
							size="small"
							style="width: 100px !important; margin-right: 10px; margin-bottom: 5px"
							@change="myGetRegionList('区', $event, index)"
						>
							<el-option
								v-for="item1 in stateData.area[item.xinzheng.cityId]"
								:key="item1.id"
								:label="item1.name"
								:value="item1.id"
							/>
						</el-select>

						<el-select
							v-model="item.xinzheng.gradeId"
							placeholder="等级"
							size="small"
							style="width: 100px !important; margin-right: 10px; margin-bottom: 5px"
							@change="myGetRailLine($event, index)"
						>
							<el-option
								v-for="item1 in stateData.grade"
								:key="item1.id"
								:label="item1.name"
								:value="item1.id"
							/>
						</el-select>

						<el-select
							v-model="item.xinzheng.lineId"
							placeholder="线路"
							size="small"
							style="width: 100px !important; margin-right: 10px; margin-bottom: 5px"
						>
							<el-option
								v-for="item1 in stateData.line[item.xinzheng.gradeId]"
								:key="item1.id"
								:label="item1.name"
								:value="item1.id"
							/>
						</el-select>
					</el-form-item>

					<el-form-item label="经纬度" class="formItem">
						<div class="jinweidu">
							<span class="text">经度: {{ item.longitude }}</span>
							<span class="text">纬度：{{ item.latitude }}</span>

							<el-input
								v-model="item.keyword"
								style="width: 100px"
								placeholder="位置"
								clearable
							/>
							<el-button type="primary" @click="search(index)">搜索</el-button>

							<el-text
								type="primary"
								size="small"
								style="cursor: pointer; margin-left: 10px"
								@click="item.isLaunch = !item.isLaunch"
								>{{ item.isLaunch ? '收起地图' : '展开地图' }}</el-text
							>
						</div>
						<div
							class="baidumapBox"
							:class="{ open: item.isLaunch, close: !item.isLaunch }"
							style="margin-right: 10px"
						>
							<div class="baidumap" :id="`baidumap${index}`"></div>
						</div>
					</el-form-item>
				</div>
			</div>
		</el-form>
		<div class="xuanxian">
			<el-tooltip class="item" effect="dark" content="删除一个杆塔" placement="top">
				<el-icon
					@click="removeItem"
					size="20"
					:class="{ disabled: form.length === 1 }"
					:color="form.length === 1 ? '#ccc' : ''"
					><ele-RemoveFilled
				/></el-icon>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="复制出一个新杆塔" placement="top">
				<el-icon @click="addItem" size="20"><ele-CirclePlusFilled /></el-icon>
			</el-tooltip>

			<el-button @click="state.dialogVisible = false" style="margin-left: 20px">取 消</el-button>
			<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { reactive, defineComponent, ref } from 'vue';
import { addToerPoles, getRegionList, getVoltageLevel, getRailLine } from '/@/api/deviceManagement/index.js';
import { ElMessage } from 'element-plus';
import { getRegion } from '/@/api/visualLargeScreen/index.js';
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
			mapExample: null,
		});

		const form = ref([
			{
				name: undefined, // 塔杆名称
				status: false, // 是否启用
				remark: undefined, // 备注
				orderNo: undefined, // 排序
				lineId: undefined,
				longitude: undefined,
				latitude: undefined,
				material: undefined, // 材质
				property: undefined, // 性质
				isLaunch: true, // 是否展开地图
				mapExample: null,
				keyword: '',

				xinzheng: {
					provinceId: null, // 省
					cityId: null, // 市
					areaId: null, // 区
					gradeId: null, // 等级
					lineId: null, // 线路
				},
			},
		]);

		const rules = reactive({
			name: [{ required: true, message: '必须输入塔杆名称', trigger: 'blur' }],
			lineId: [{ required: true, message: '必须选择线路', trigger: 'blur' }],
		});

		const stateData = reactive({
			province: [],
			city: {},
			area: {},
			grade: [], // 等级
			line: {
				// 线路
			},
		});

		// 获取所有省份
		async function myGetRegion() {
			const res = await getRegion(0);
			stateData.province = res.data.result;
		}

		// 获取省以下级别
		async function myGetRegionList(type, pid, index) {
			if ((type === '省' && stateData.city[pid]) || (type === '市' && stateData.area[pid])) {
				return;
			}
			if (type === '区') {
				myGetVoltageLevel(index);
				return;
			}
			const res = await getRegionList({
				page: 1,
				pageSize: 10000,
				pid,
				excludeSelf: true,
			});

			if (type === '省' && !stateData.city[pid]) {
				stateData.city[pid] = res.data.result.items;

				form.value[index].xinzheng.cityId = null;
			} else if (type === '市' && !stateData.area[pid]) {
				stateData.area[pid] = res.data.result.items;
			}

			form.value[index].xinzheng.areaId = null;
			form.value[index].xinzheng.gradeId = null;
			form.value[index].xinzheng.lineId = null;
		}

		// 获取等级列表
		async function myGetVoltageLevel(index) {
			const res = await getVoltageLevel();
			stateData.grade = res.data.result;
			form.value[index].xinzheng.lineId = null;
		}

		// 获取线路
		async function myGetRailLine(id, index) {
			const res = await getRailLine({
				countyId: form.value[index].xinzheng.areaId, // 区县id
				voltageLevelId: id, // 电压等级
			});
			stateData.line[id] = res.data.result;
		}

		// 开启弹窗
		function open() {
			state.dialogVisible = true;
			myGetRegion();
			setTimeout(() => {
				initBaiduMap(0);
			}, 200);
		}

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
			wipeData();
		}

		async function submitForm() {
			form.value.forEach((item) => {
				item.xinzheng.lineId && (item.lineId = item.xinzheng.lineId);
			});

			if (validate()) {
				return;
			}

			state.loading = true;
			const arr = form.value.map((item) => {
				return {
					name: item.name,
					orderNo: item.orderNo,
					remark: item.remark,
					status: item.status ? 1 : 2,
					lineId: item.lineId,
					longitude: +item.longitude * 1000000,
					latitude: +item.latitude * 1000000,
					material: item.material,
					property: item.property,
				};
			});
			try {
				await addToerPoles({ poles: arr });
			} catch (err) {
				state.loading = false;
				return;
			}

			state.loading = false;
			emit('complete');
			close();
			ElMessage({
				message: `添加塔杆成功`,
				type: 'success',
			});
		}

		// 初始化百度地图
		function initBaiduMap(index, coveringMaterial = null) {
			form.value[index].mapExample = new BMapGL.Map('baidumap' + index); // "mapContainer" 是你地图容器的 ID
			form.value[index].mapExample.enableScrollWheelZoom(true);
			const point = new BMapGL.Point(116.404, 39.925); // 地图中心点
			form.value[index].mapExample.centerAndZoom(point, 15); // 创建地图并设置中心点

			form.value[index].mapExample.addEventListener('click', (e) => {
				form.value[index].mapExample.clearOverlays(); // 清除地图上的所有覆盖物
				form.value[index].longitude = e.latlng.lng.toFixed(5);
				form.value[index].latitude = e.latlng.lat.toFixed(5);
				var point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
				var marker = new BMapGL.Marker(point); // 创建标注
				form.value[index].mapExample.addOverlay(marker); // 将标注添加到地图中
			});

			if (coveringMaterial) {
				var point1 = new BMapGL.Point(coveringMaterial.longitude, coveringMaterial.latitude);
				var marker = new BMapGL.Marker(point1); // 创建标注
				form.value[index].mapExample.addOverlay(marker); // 将标注添加到地图中
			}
		}

		// 搜索地区
		function search(index) {
			var local = new BMapGL.LocalSearch(form.value[index].mapExample, {
				renderOptions: { map: form.value[index].mapExample },
			});
			local.search(form.value[index].keyword);
		}

		function wipeData() {
			state.dialogVisible = false;
			state.loading = false;
			state.keyword = undefined;
			state.mapExample = null;

			form.value.length = 0;
			form.value.push({
				name: undefined, // 塔杆名称
				status: false, // 是否启用
				remark: undefined, // 备注
				orderNo: undefined, // 排序
				lineId: undefined,
				longitude: undefined,
				latitude: undefined,
				material: undefined, // 材质
				property: undefined, // 性质
				mapExample: null,
				keyword: '',
				xinzheng: {
					provinceId: null, // 省
					cityId: null, // 市
					areaId: null, // 区
					gradeId: null, // 等级
					lineId: null, // 线路
				},
			});
		}

		function removeItem() {
			if (form.value.length === 1) {
				return;
			}

			form.value.splice(form.value.length - 1, 1);
		}

		function addItem() {
			const item = form.value[form.value.length - 1];
			form.value.push({
				name: item.name, // 塔杆名称
				status: item.status, // 是否启用
				remark: item.remark, // 备注
				orderNo: item.orderNo, // 排序
				lineId: item.lineId,
				longitude: item.longitude,
				latitude: item.latitude,
				material: item.material, // 材质
				property: item.property, // 性质
				isLaunch: true,
				xinzheng: {
					provinceId: item.xinzheng.provinceId, // 省
					cityId: item.xinzheng.cityId, // 市
					areaId: item.xinzheng.areaId, // 区
					gradeId: item.xinzheng.gradeId, // 等级
					lineId: item.xinzheng.lineId, // 线路
				},
			});
			setTimeout(() => {
				const obj =
					item.longitude && item.latitude
						? { longitude: item.longitude, latitude: item.latitude }
						: null;
				initBaiduMap(form.value.length - 1, obj);
			}, 16);
		}

		function validate() {
			let tips = null;
			for (let i = 0; i < form.value.length; i++) {
				const item = form.value[i];
				if (!item.name) {
					tips = `第${i + 1}项塔杆名称不能为空`;
				} else if (!item.remark) {
					tips = `第${i + 1}项备注不能为空`;
				} else if (!item.lineId) {
					tips = `第${i + 1}项必须选择线路`;
				} else if (!item.longitude && !item.latitude) {
					tips = `第${i + 1}项必须有经纬度`;
				} else if (!item.material) {
					tips = `第${i + 1}项材质不能为空`;
				} else if (!item.property) {
					tips = `第${i + 1}项性质不能为空`;
				}
				if (tips) {
					break;
				}
			}

			tips &&
				ElMessage({
					message: tips,
					type: 'warning',
				});

			return tips;
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
			removeItem,
			addItem,
			stateData,
			myGetRegionList,
			myGetRailLine,
		};
	},
});
</script>

<style lang="scss" scoped>
.dialog-footer {
	margin-top: 0px;
	text-align: center;
}

.jinweidu {
	margin-bottom: 5px;

	.text {
		display: inline-block;
		width: 100px;
	}
}

.baidumapBox {
	width: 100%;
	overflow: hidden;
	transition: all 0.3s;

	&.open {
		height: 250px;
	}

	&.close {
		height: 0px;
	}

	.baidumap {
		width: 100%;
		height: 250px;
	}
}

.mainContent {
	height: 56vh;
	overflow: auto;
	border: 1px dashed #eed;
	margin-bottom: 20px;

	.itemBox {
		border: 1px solid #ccc;
		border-radius: 9px;
		margin: 10px;
	}

	.formItem {
		margin: 5px 0;
	}
}

.xuanxian {
	width: 100%;
	display: flex;
	align-content: center;
	justify-content: center;
	margin: 0 0 2px 0;

	.el-icon {
		cursor: pointer;
		margin-right: 20px;
		transition: all 0.2s;
		transform: scale(1);

		&:not(.disabled):hover {
			transform: scale(1.2);
		}

		&.disabled {
			cursor: no-drop;
		}
	}
}

.el-form-item__content {
	flex: 0;
}
</style>
