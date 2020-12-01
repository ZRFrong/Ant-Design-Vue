<template>
  <a-modal
    title="操作"
    style="top: 20px"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display: none">
        <a-input v-decorator="['qrCodeId']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="心跳名称">
        <a-input placeholder="心跳名称" v-decorator="['heartbeatText']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备id">
        <a-input placeholder="设备id" v-decorator="['equipmentId']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="二维码链接地址">
        <a-input placeholder="二维码链接地址" v-decorator="['qrCodeUrl']" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生产日期">
        <!-- <a-date-picker @change="onChange" v-decorator="['equipmentProductionDate']" /> -->
        <!-- <a-input type="date" placeholder="生产日期" v-decorator="['equipmentProductionDate']" /> -->
        <a-date-picker placeholder="年/月/日" v-decorator="web_decorator_startDate" @change="onChange" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生产地点">
        <a-input placeholder="生产地点" v-decorator="['equipmentProductionSite']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="生产批次">
        <a-input placeholder="生产批次" v-decorator="['equipmentProductionBatch']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="产品型号">
        <a-input placeholder="产品型号" v-decorator="['equipmentModel']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveDbQrCode } from '@/api/fangyuanapi'
import pick from 'lodash.pick'

export default {
  name: 'DbQrCodeModal',
  props: {},
  components: {},
  data() {
    return {
      visible: false,
      web_decorator_startDate: ['equipmentProductionDate', { rules: [{ required: true, message: '请选择生产日期' }] }],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this),
    }
  },
  beforeCreate() {},
  created() {},
  methods: {
    onChange(date, dateString) {
      console.log(date, dateString)
    },
    add() {
      this.form.resetFields()
      this.edit({ qrCodeId: 0 })
    },
    edit(record) {
      console.log(record, 'record')
      
      this.mdl = Object.assign(record)
      
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'qrCodeId',
            'heartbeatText',
            'createTime',
            'equipmentId',
            'qrCodeUrl',
            'equipmentProductionDate',
            'equipmentProductionSite',
            'equipmentProductionDate',
            'equipmentProductionBatch',
            'equipmentModel'
          )
        )
      })
    },
    handleSubmit(e) {
      
      // let fieldsValue = this.form.getFieldsValue()
      // let equipmentProductionDate = moment(fieldsValue.equipmentProductionDate).format('YYYY-MM-DD')
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveDbQrCode(values)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$emit('ok')
                this.visible = false
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              this.$message.error('系统错误，请稍后再试')
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    getCurrentStyle(current, today) {
      const style = {}
      if (current.date() === 1) {
        style.border = '1px solid #1890ff'
        style.borderRadius = '50%'
      }
      return style
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
