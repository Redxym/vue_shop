<template>
<div>
  <!--面包屑导航栏-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片视图-->
  <el-card>
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--订单列表数据-->
    <el-table :data="orderList" border stripe>
      <el-table-column type="index">#</el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template v-slot="scope">
          <el-tag v-if="scope.row.pay_status === '1'" type="primary">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send">
        <template v-slot="scope">
          {{scope.row.is_send}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template v-slot="scope">
          {{scope.row.create_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
          <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 100, 400]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
  </el-card>
  <!--修改地址弹出框-->
  <el-dialog title="修改地址" :visible="addressVisible" width="50%" @close="addressDialogClosed">
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
      <el-form-item label="省市区/县" prop="address1">
        <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addressVisible = false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </span>
  </el-dialog>
  <!--展示物流进度的对话框-->
  <el-dialog title="物流进度" :visible="progressVisible" width="50%">
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
    </el-timeline>
    <span slot="footer" class="dialog-footer">
      <el-button @click="progressVisible = false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      // 物流信息
      progressInfo: [],
      reverse: false
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('订单列表获取失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 展示修改得对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get(`/kuaidi/804909574412544580`)
      if (res.meta.status !== 200) {
        return this.$message.error('物流信息获取失败！')
      }
      this.progressInfo = res.data
      console.log(111, this.progressInfo)
      this.progressVisible = true
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
