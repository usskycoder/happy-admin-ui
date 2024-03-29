<template>
	<el-drawer v-model="visible" size="40%" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="name" label="名称">
				<el-input v-model="dataForm.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item prop="pid" label="上级机构">
				<el-tree-select
					v-model="dataForm.pid"
					:data="orgList"
					value-key="id"
					check-strictly
					:render-after-expand="false"
					:props="{ label: 'name', children: 'children' }"
					style="width: 100%"
					clearable
				/>
			</el-form-item>
			<el-form-item prop="sort" label="排序">
				<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useOrgListApi, useOrgSubmitApi } from '@/api/sys/orgs'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const orgList = ref([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	pid: '',
	parentName: '',
	sort: 0
})

const init = (isUpdate: boolean, row: any) => {
	visible.value = true

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// 更新表单数据
	if (row) {
		getOrg(isUpdate, row)
	} else {
		dataForm.pid = ''
		dataForm.parentName = ''
	}

	// 机构列表
	getOrgList()
}

// 获取机构列表
const getOrgList = async () => {
	const res = await useOrgListApi()
	orgList.value = res.data
}

// 获取信息
const getOrg = (isUpdate: boolean, row: any) => {
	Object.assign(dataForm, row)
	if (!isUpdate) {
		// 是新增，重置表单数据
		dataForm.pid = dataForm.id
		dataForm.parentName = dataForm.name
		dataForm.id = ''
		dataForm.name = ''
		dataForm.sort = 0
	}
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	parentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useOrgSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>

<style lang="scss" scoped>
.org-list {
	::v-deep(.el-input__inner) {
		cursor: pointer;
	}
	::v-deep(.el-input__suffix) {
		cursor: pointer;
	}
}
</style>
