<template>
  <a-modal
    title="操作"
    style="top: 20px"
    :width="1800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display: none">
        <a-input v-decorator="['equipmentTemId']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模板名称">
        <a-input
          placeholder="模板名称"
          v-decorator="['tempName', { rules: [{ required: true, message: '请输入模板名称' }] }]"
        />
      </a-form-item>

      <!-- <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="操作集"
      > 
        <a-input placeholder="操作集" v-decorator="['handleText', {rules: [{ required: true, message: '请输入操作集' }]}]" />
      </a-form-item> -->

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作集">
        <a-form-item v-for="(domain, i) in dynamicValidateForm.domains" :key="domain.key" class="domain">
          <a-select style="width: 8%;margin-right: 8px" v-model="domain.checkCode">
            <a-select-option :value="'1'">卷帘</a-select-option>
            <a-select-option :value="'2'">卷膜</a-select-option>
            <a-select-option :value="'3'">补光</a-select-option>
            <a-select-option :value="'4'">浇水</a-select-option>
          </a-select>
          <a-input v-model="domain.checkName" style="width: 7%" />

          -----------
          <a-form-item v-for="item in dynamicValidateForm.domains[i].spList" :key="item.key" class="item">
              <a-select style="width: 35%;margin-right: 8px" v-model="item.handleName">
                <a-select-option :value="'start'">卷起</a-select-option>
                <a-select-option :value="'start_stop'">暂停</a-select-option>
                <a-select-option :value="'down'">放下</a-select-option>
                <a-select-option :value="'down_stop'">停止</a-select-option>
              </a-select>
              <a-input v-model="item.handleCode" style="width: 51%; margin-right: 8px" />
          </a-form-item>
          <a-button
            type="primary"
            style="margin-right: 8px"
            shape="circle"
            icon="plus"
            :size="size"
            @click="addCross(i)"
          />
          <a-button type="primary" shape="circle" icon="minus" :size="size" @click="subtract(i)" />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            style="margin-right: 8px"
            shape="circle"
            icon="plus"
            :size="size"
            @click="addVertical"
          />
          <a-button type="primary" shape="circle" icon="minus" :size="size" @click="removeDomain" />
        </a-form-item>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="plc版本">
        <a-input
          placeholder="plc版本"
          v-decorator="['plcVersion', { rules: [{ required: true, message: '请输入plc版本' }] }]"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
        <a-textarea
          :rows="5"
          placeholder="描述"
          v-decorator="['describeText', { rules: [{ required: true, message: '请输入描述' }] }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveDbEquipmentTemp } from '@/api/fangyuanapi'
import pick from 'lodash.pick'
import InfoVue from '../../list/components/Info.vue'
export default {
  name: 'DbEquipmentTempModal',
  props: {},
  components: {},
  data() {
    return {
      // 操作集
      dynamicValidateForm: {
        domains: [],
      },

      visible: false,
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
    // 操作集删除一行，剩一个保留
    removeDomain() {
      if (this.dynamicValidateForm.domains.length <= 1) {
        return
      } else {
        this.dynamicValidateForm.domains.pop()
      }
    },
    // 操作集给行添加操作项
    addCross(i) {
      console.log(i, 'i')

      this.dynamicValidateForm.domains[i].spList.push({
        value: '',
      })
    },
    // 操作集删除行操作项
    subtract(i) {
      this.dynamicValidateForm.domains[i].spList.pop()
    },
    // 操作集添加一行
    addVertical() {
      this.dynamicValidateForm.domains.push({
        spList: [{}],
      })

      // let spList = new Array({});
      // console.log(spList,'sp')
      // this.dynamicValidateForm.domains.forEach((item,j) =>{
      //   item.spList = spList;
      // })
      console.log(this.dynamicValidateForm.domains, '数组')
    },

    add() {
      this.form.resetFields()
      this.edit({ equipmentTemId: 0 })
    },
    edit(record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.mdl, 'equipmentTemId', 'tempName', 'handleText', 'plcVersion', 'describeText')
        )
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveDbEquipmentTemp(values)
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
<style scoped>
.domain {
  margin-bottom: 5px;
}
.item {
  display: inline-block;
  width: 200px;
  
  margin-bottom: 5px;
}
</style>