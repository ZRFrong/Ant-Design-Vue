<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="地区">
              <a-input placeholder="请输入地区" v-model="queryParam.region"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="经度">
              <a-input placeholder="请输入经度" v-model="queryParam.longitude"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="纬度">
              <a-input placeholder="请输入纬度" v-model="queryParam.latitude"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="产品类别">
              <a-input placeholder="请输入产品类别" v-model="queryParam.productCategory"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="产品名称">
              <a-input placeholder="请输入产品名称" v-model="queryParam.productName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="备注信息">
              <a-input placeholder="请输入备注信息" v-model="queryParam.noteText"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="关联用户id">
              <a-input placeholder="请输入关联用户id" v-model="queryParam.dbUserId"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="别称自定义">
              <a-input placeholder="请输入别称自定义" v-model="queryParam.nickName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="地区id">
              <a-input placeholder="请输入地区id" v-model="queryParam.siteId"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="设备集">
              <a-input placeholder="请输入设备集" v-model="queryParam.equipmentIds"/>
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
      <a-dropdown v-if="removeEnable.length&&(selectedRowKeys.length) > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="landId"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :data="data"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.landId])">删除</a>
      </span>
    </s-table>
    <dbLand-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { list, delDbLand } from '@/api/land'
import DbLandModal from './modules/DbLandModal.vue'
import { treeData } from '@/utils/treeutil'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'TableList',
  components: {
    STable,
    DbLandModal
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
          title: '地区',
          dataIndex: 'region'
        },
        {
          title: '经度',
          dataIndex: 'longitude'
        },
        {
          title: '纬度',
          dataIndex: 'latitude'
        },
        {
          title: '产品类别',
          dataIndex: 'productCategory'
        },
        {
          title: '产品名称',
          dataIndex: 'productName'
        },
        {
          title: '备注信息',
          dataIndex: 'noteText'
        },
        {
          title: '关联用户id',
          dataIndex: 'dbUserId'
        },
        {
          title: '别称自定义',
          dataIndex: 'nickName'
        },
        {
          title: '地区id',
          dataIndex: 'siteId'
        },
        {
          title: '设备集',
          dataIndex: 'equipmentIds'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
       data: parameter => {
        return list(Object.assign(parameter, this.queryParam))
      },
      pagination: false,
      loading: false,
      addEnable: checkPermission('fangyuanapi:dbLand:add'),
      editEnabel: checkPermission('fangyuanapi:dbLand:edit'),
      removeEnable: checkPermission('fangyuanapi:dbLand:remove')
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
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      delDbLand({ ids: ids.join(',') }).then(res => {
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
