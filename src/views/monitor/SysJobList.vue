<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="方法参数">
              <a-input placeholder="请输入方法参数" v-model="queryParam.methodParams" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="cron执行表达式">
              <a-input placeholder="请输入cron执行表达式" v-model="queryParam.cronExpression" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="计划执行错误策略">
              <a-input placeholder="请输入计划执行错误策略" v-model="queryParam.misfirePolicy" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="是否并发执行">
              <a-input placeholder="请输入是否并发执行" v-model="queryParam.concurrent" />
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
      rowKey="jobId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.jobId])">删除</a>
      </span>
    </s-table>
    <sysJob-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from "@/components";
import { getSysJobList, delSysJob } from "@/api/monitor";
import SysJobModal from "./modules/SysJobModal.vue";
import { checkPermission } from "@/utils/permissions";

export default {
  
  name: "TableList",
  components: {
    STable,
    SysJobModal,
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
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: "任务名称",
          dataIndex: "jobName",
        },
        {
          title: "任务组名",
          dataIndex: "jobGroup",
        },
        {
          title: "任务方法",
          dataIndex: "methodName",
        },
        {
          title: "方法参数",
          dataIndex: "methodParams",  
          
        },
        {
          title: "cron执行表达式",
          dataIndex: "cronExpression",  

        },
        {
          title: "计划执行错误策略",
          dataIndex: "misfirePolicy",  

        },
        {
          title: "是否并发执行",
          dataIndex: "concurrent",
        },
        {
          title: "状态",
          dataIndex: "status",
        },
        {
          title: "备注信息",
          dataIndex: "remark",
        },
        {
          title: "操作",
          width: "200px",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getSysJobList(Object.assign(parameter, this.queryParam));
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission("system:sysJob:add"),
      editEnabel: checkPermission("system:sysJob:edit"),
      removeEnable: checkPermission("system:sysJob:remove"),
    };
  },
  filters: {},
  created() {},
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    handleAdd() {
      this.$refs.modal.add();
    },
    handleEdit(record) {
      this.$refs.modal.edit(record);
      
    },
    handleOk() {
      this.$refs.table.refresh(true);
      console.log("handleSaveOk");
    },
    delByIds(ids) {
      delSysJob({ ids: ids.join(",") }).then((res) => {
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.handleOk();
          
        } else {
          this.$message.error(res.msg);
        }
        this.selectedRowKeys = [];
      });
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
};
</script>
