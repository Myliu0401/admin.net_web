<template>
	<el-dialog title="添加塔杆" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%"
		:before-close="handleClose">
		<div class="xuanxian">
			<el-icon @click="removeItem" size="20" :class="{ disabled: form.length === 1 }"
				:color="form.length === 1 ? '#ccc' : ''"><ele-RemoveFilled /></el-icon>
			<el-icon @click="addItem" size="20"><ele-CirclePlusFilled /></el-icon>
		</div>
		<el-form v-loading="state.loading" ref="ruleFormRef" label-width="70px">

			<div class="mainContent">
				<div v-for="item, index in form" :key="index" class="itemBox">
					<el-form-item label="塔杆名称">
						<el-input v-model="item.name" />
					</el-form-item>

					<el-form-item label="备注">
						<el-input v-model="item.remark" />
					</el-form-item>

					<el-form-item label="排序">
						<el-input v-model="item.orderNo" type="number" style="width: 150px" min="1" />
					</el-form-item>

					<el-form-item label="材质">
						<el-input v-model="item.material" style="width: 150px" min="1" />
					</el-form-item>

					<el-form-item label="性质">
						<el-input v-model="item.property" style="width: 150px" min="1" />
					</el-form-item>

					<el-form-item label="通用状态">
						<el-switch inline-prompt active-text="启用" inactive-text="禁用" v-model="item.status" />
					</el-form-item>

					<el-form-item label="直属线路">
						<el-select v-model="item.lineId" clearable placeholder="直属线路" size="small"
							style="width: 150px; min-width: 150px; margin-right: 10px">
							<el-option v-for="item1 in railLines" :key="item1.value" :label="item1.label"
								:value="item1.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="经纬度">
						<div class="jinweidu">
							<span class="text">经度: {{ item.longitude }}</span>
							<span class="text">纬度：{{ item.latitude }}</span>

							<el-input v-model="item.keyword" style="width: 100px" placeholder="位置" clearable />
							<el-button type="primary" @click="search(index)">搜索</el-button>
						</div>
						<div class="baidumap" :id="`baidumap${index}`"></div>
					</el-form-item>
				</div>

			</div>


			<el-form-item class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>


<script>
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
			mapExample: null,
		});

		const form = ref([
			{
				name: undefined, // 塔杆名称
				status: false, // 通用状态
				remark: undefined, // 备注
				orderNo: undefined, // 排序
				lineId: undefined,
				longitude: undefined,
				latitude: undefined,
				material: undefined, // 材质
				property: undefined, // 性质

				mapExample: null,
				keyword: ''
			}
		]);

		const rules = reactive({
			name: [{ required: true, message: '必须输入塔杆名称', trigger: 'blur' }],
			lineId: [{ required: true, message: '必须选择线路', trigger: 'blur' }],
		});

		// 开启弹窗
		function open() {
			state.dialogVisible = true;
			setTimeout(() => {
				initBaiduMap(0)
			}, 200);
		}

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
			wipeData();
		}

		async function submitForm(ruleFormRef) {

			if (validate()) {
				return
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
				}
			});
			try {
				await addToerPoles(arr);
			} catch (err) {
				state.loading = false;
				return
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
		function initBaiduMap(index) {
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
				status: false, // 通用状态
				remark: undefined, // 备注
				orderNo: undefined, // 排序
				lineId: undefined,
				longitude: undefined,
				latitude: undefined,
				material: undefined, // 材质
				property: undefined, // 性质
				mapExample: null,
				keyword: ''
			})
		}

		function removeItem() {
			if (form.value.length === 1) {
				return
			}

			form.value.splice(form.value.length - 1, 1);
		}

		function addItem() {
			form.value.push({
				name: undefined, // 塔杆名称
				status: false, // 通用状态
				remark: undefined, // 备注
				orderNo: undefined, // 排序
				lineId: undefined,
				longitude: undefined,
				latitude: undefined,
				material: undefined, // 材质
				property: undefined, // 性质
			});
			setTimeout(() => {
				initBaiduMap(form.value.length - 1)
			}, 16)
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
				};
				if (tips) {
					break;
				}
			};

			tips && ElMessage({
				message: tips,
				type: 'warning',
			});

			return tips;
		}

		return { state, open, close, form, rules, submitForm, ruleFormRef, search, removeItem, addItem };
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
	height: 250px;
}

.mainContent {
	height: 56vh;
	overflow: auto;

	.itemBox {
		margin-bottom: 25px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ccc;
	}
}

.xuanxian {
	width: 100%;
	display: flex;
	align-content: center;
	justify-content: center;
	margin-bottom: 20px;

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

.el-form-item__content{
	flex: 0;
}
</style>