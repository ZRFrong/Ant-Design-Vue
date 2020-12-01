<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['landId']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地区">
        <a-input placeholder="地区" v-decorator="['region']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="经度">
        <a-input placeholder="经度" v-decorator="['longitude']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="纬度">
        <a-input placeholder="纬度" v-decorator="['latitude']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="产品类别">
        <a-input placeholder="产品类别" v-decorator="['productCategory']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="产品名称">
        <a-input placeholder="产品名称" v-decorator="['productName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注信息">
        <a-input placeholder="备注信息" v-decorator="['noteText']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关联用户id">
        <a-input placeholder="关联用户id" v-decorator="['dbUserId']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="别称自定义">
        <a-input placeholder="别称自定义" v-decorator="['nickName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地区id">
        <a-input placeholder="地区id" v-decorator="['siteId']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备集">
        <a-input placeholder="设备集" v-decorator="['equipmentIds']"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveDbLand } from '@/api/land'
import pick from 'lodash.pick'
export default {
  name: 'DbLandModal',
  props: {
  },
  components: {
  },
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      trees: [{ key: '0', value: '0', title: '无' }],
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    
  },
  methods: {
    add (parentId) {
      this.form.resetFields()
      this.edit({ landId: 0,siteId: parentId || 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'landId','region','longitude','latitude','productCategory','productName','noteText','createTime','dbUserId','nickName','siteId','equipmentIds'))
      })
    },
	  
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveDbLand(values).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.success(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
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
