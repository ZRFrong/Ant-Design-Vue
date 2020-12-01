<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="心跳名称">
              <a-input placeholder="请输入心跳名称" v-model="queryParam.heartbeatText"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="是否取消服务">
              <a-input placeholder="请输入是否取消服务" v-model="queryParam.isPause"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="取消说明">
              <a-input placeholder="请输入取消说明" v-model="queryParam.pauseState"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="是否发生故障">
              <a-input placeholder="请输入是否发生故障" v-model="queryParam.isFault"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="设备模板id">
              <a-input placeholder="请输入设备模板id" v-model="queryParam.equipmentTemplateId"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="设备号">
              <a-input placeholder="请输入设备号" v-model="queryParam.equipmentNo"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="操作集">
              <a-input placeholder="请输入操作集" v-model="queryParam.handlerText"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="是否在线">
              <a-input placeholder="请输入是否在线" v-model="queryParam.isOnline"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="equipmentId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.equipmentId])">删除</a>
      </span>
    </s-table>
    <dbEquipment-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDbEquipmentList, delDbEquipment } from '@/api/fangyuanapi'
import DbEquipmentModal from './modules/DbEquipmentModal.vue'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'TableList',
  components: {
    STable,
    DbEquipmentModal
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '心跳名称',
          dataIndex: 'heartbeatText'
        },
        {
          title: '使用期限',
          dataIndex: 'allottedTime',
          sorter: true
        },
        {
          title: '是否取消服务',
          dataIndex: 'isPause'
        },
        {
          title: '取消说明',
          dataIndex: 'pauseState'
        },
        {
          title: '是否发生故障',
          dataIndex: 'isFault'
        },
        {
          title: '设备模板id',
          dataIndex: 'equipmentTemplateId'
        },
        {
          title: '设备号',
          dataIndex: 'equipmentNo'
        },
        {
          title: '操作集',
          dataIndex: 'handlerText'
        },
        {
          title: '是否在线',
          dataIndex: 'isOnline'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDbEquipmentList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('fangyuanapi:dbEquipment:add'),
      editEnabel: checkPermission('fangyuanapi:dbEquipment:edit'),
      removeEnable: checkPermission('fangyuanapi:dbEquipment:remove')
    }
  },
  filters: {
  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
      console.log(record,'11')
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      delDbEquipment({ ids: ids.join(',') }).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
