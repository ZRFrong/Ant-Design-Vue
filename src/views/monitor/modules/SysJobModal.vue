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
     <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="任务名称"
      >
        <a-input placeholder="任务名称" v-decorator="['jobName', {rules: [{ required: true, message: '请输入任务名称' }]}]" />
      </a-form-item>
     <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="任务组名"
      >
        <a-input placeholder="任务组名" v-decorator="['jobGroup', {rules: [{ required: true, message: '请输入任务组名' }]}]" />
      </a-form-item>
     <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="任务方法"
      >
        <a-input placeholder="任务方法" v-decorator="['methodName', {rules: [{ required: true, message: '请输入任务方法' }]}]" />
      </a-form-item>
     
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="方法参数">
        <a-input placeholder="方法参数" v-decorator="['methodParams']"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="cron执行表达式"
      >
        <a-input placeholder="cron执行表达式" v-decorator="['cronExpression', {rules: [{ required: true, message: '请输入正确的cron执行表达式' }]}]" />
      </a-form-item>
      
      <a-form-item
        label="计划执行错误策略"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group v-decorator="['misfirePolicy',{initialValue:'1'}]">
          <a-radio :value="'1'">立即执行</a-radio>
          <a-radio :value="'2'">执行一次</a-radio>
          <a-radio :value="'3'">放弃执行</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="是否并发执行"
      >
        <a-select v-decorator="['concurrent', {initialValue:'0',rules: [{ required: true, message: '请选择状态' }]}]">
          <a-select-option :value="'0'">允许</a-select-option>
          <a-select-option :value="'1'">禁用</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group v-decorator="['status',{initialValue:'0'}]">
          <a-radio :value="'0'">正常</a-radio>
          <a-radio :value="'1'">暂停</a-radio>

        </a-radio-group>
      </a-form-item>
      
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="备注"
      >
        <a-textarea :rows="5" placeholder="备注" v-decorator="['remark', {rules: [{ required: true, message: '请输入备注' }]}]"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { saveSysJob } from '@/api/monitor'
import pick from 'lodash.pick'

export default {
  
  name: 'SysJobModal',
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
    add () {
      this.form.resetFields()
      this.edit({ jobId: 0 })
    },
    edit (record) {
      
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'jobName', 'jobGroup', 'methodName', 'methodParams', 'cronExpression', 'misfirePolicy', 'concurrent', 'status', 'remark'))
      })
    },
    handleSubmit (e) {
      console.log(e,'aaa')
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveSysJob(values).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.$emit('ok')
              this.visible = false
              
            } else {
              this.$message.error(res.msg)
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
