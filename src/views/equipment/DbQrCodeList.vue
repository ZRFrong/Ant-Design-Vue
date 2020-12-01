<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="心跳名称">
              <a-input placeholder="请输入心跳名称" v-model="queryParam.heartbeatText" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="管理员用户id">
              <a-input placeholder="请输入管理员用户id" v-model="queryParam.adminUserId" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="设备id">
              <a-input placeholder="请输入设备id" v-model="queryParam.equipmentId" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="二维码链接地址">
              <a-input placeholder="请输入二维码链接地址" v-model="queryParam.qrCodeUrl" />
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="15">
            <a-form-item label="生产日期">
              <a-input placeholder="请输入生产日期" v-model="queryParam.equipmentProductionDate" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="生产地点">
              <a-input placeholder="请输入生产地点" v-model="queryParam.equipmentProductionSite" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="生产批次">
              <a-input placeholder="请输入生产批次" v-model="queryParam.equipmentProductionBatch" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="产品型号">
              <a-input placeholder="请输入产品型号" v-model="queryParam.equipmentModel" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable && selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="qrCodeId"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data="loadData"
    >
      <img
        style="width: 30px; heigth: 30px; cursor: pointer"
        slot="qrCodeUrl"
        :src="text"
        @click="handlePreview(text)"
      />

      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.qrCodeId])">删除</a>
        <a-divider type="vertical" />
        <a @click="generate([record.qrCodeId])">生成二维码</a>
      </span>
    </s-table>
    <dbQrCode-modal ref="modal" @ok="handleOk" />
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel">
      <img style="width: 100%" :src="text" />
      <button @click="download">下载</button>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDbQrCodeList, delDbQrCode, generateQrCode } from '@/api/fangyuanapi'
import DbQrCodeModal from './modules/DbQrCodeModal.vue'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'TableList',
  components: {
    STable,
    DbQrCodeModal,
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      text: '',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '心跳名称',
          dataIndex: 'heartbeatText',
        },
        {
          title: '设备id',
          dataIndex: 'equipmentId',
        },
        {
          title: '二维码链接地址',
          dataIndex: 'qrCodeUrl',
          scopedSlots: { customRender: 'qrCodeUrl' },
        },
        {
          title: '生产地点',
          dataIndex: 'equipmentProductionSite',
        },
        {
          title: '生产日期',
          dataIndex: 'equipmentProductionDate',
          sorter: true,
        },
        {
          title: '生产批次',
          dataIndex: 'equipmentProductionBatch',
        },
        {
          title: '产品型号',
          dataIndex: 'equipmentModel',
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDbQrCodeList(Object.assign(parameter, this.queryParam))
      },
      previewVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('fangyuanapi:dbQrCode:add'),
      editEnabel: checkPermission('fangyuanapi:dbQrCode:edit'),
      removeEnable: checkPermission('fangyuanapi:dbQrCode:remove'),
    }
  },
  filters: {},
  created() {},
  methods: {
    previewCancel() {
      this.previewVisible = false
    },
    handlePreview(url) {
      this.previewImage = url
      this.previewVisible = true
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd() {
      this.$refs.modal.add()
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds(ids) {
      delDbQrCode({ ids: ids.join(',') }).then((res) => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
      })
    },
    generate(qrCodeId) {
      generateQrCode({ qrCodeId: qrCodeId.join(',') }).then((res) => {
        console.log(res, 'res')
        if (res.code === 200) {
          this.$message.success('生成二维码成功')
          this.text = res.data
        }
      })
    },
    download() {
      var image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      var _this = this
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = _this.projectName || 'myImage' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = this.text
    },
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
  },
}
</script>

