<template>
 <div class="p-20px">
        <div class="mb-40px">
            <Form
                name="search"
                layout='inline'
                :colon="false"
                :model="formData"
                @finish="getStatisticData"
            >
                <FormItem label="开始日期" name="startTime">
                    <DatePicker v-model:value="formData.startTime" valueFormat="YYYY-MM-DD" />
                </FormItem>

                <FormItem label="结束日期" name="endTime">
                    <DatePicker v-model:value="formData.endTime" valueFormat="YYYY-MM-DD"  />
                </FormItem>

                <FormItem label="图表类型" name="chartType" >
                    <Select dropdownMenuStyle="width: 200px"   v-model:value="chartType" >
                        <SelectOption value="pie">饼图</SelectOption>
                        <SelectOption value="bar">柱形图</SelectOption>
                    </Select>
                </FormItem>

                <FormItem>
                    <Button type="primary" html-type="submit">
                        查询
                    </Button>
                </FormItem>
            </Form>
        </div>
        <div class="w-800px h-600px" ref="chartsRef"></div>
        <div class="w-800px h-600px" ref="chartsRef2"></div>
    </div>
</template>

<script setup lang="ts">
import { Button, Form, FormItem, Select, DatePicker, SelectOption  } from "ant-design-vue";
import dayjs from "dayjs";
import * as echarts from 'echarts';
import { userBookingCountApi, meetingRoomUsedCountApi } from '~/api/statistics';

const FORMAT_DATE = 'YYYY-MM-DD';


const lastMonthFirstDay = dayjs().add(-1, 'month').subtract(1).startOf('month').format(FORMAT_DATE);
const currDay = dayjs().format(FORMAT_DATE)

const formData = reactive({
  startTime: lastMonthFirstDay,
  endTime: currDay,
})


const chartType = ref('bar')



const userBookingData = ref<Statistics.userBookingResp[]>([])
const meetingRoomUsedData = ref<Statistics.meetingRoomUsedResp[]>([])

  async function getStatisticData() {
        const startTime = dayjs(formData.startTime).format('YYYY-MM-DD');
        const endTime = dayjs(formData.endTime).format('YYYY-MM-DD');
        const resp = await userBookingCountApi({startTime, endTime})
        const resp2 = await meetingRoomUsedCountApi({startTime, endTime})
        console.log(resp.data);
        console.log(resp2.data);
        userBookingData.value = resp.data
        meetingRoomUsedData.value = resp2.data
        renderChart()
        renderChart2()
    }

    const chartsRef = ref<HTMLDivElement | null>(null)
    const chartsRef2 = ref<HTMLDivElement | null>(null)


   function renderChart() {
      const myChart = echarts.init(chartsRef.value);
        myChart.setOption({
            title: {
                text: '用户预定情况'
            },
            tooltip: {},
            xAxis: {
                data: userBookingData.value?.map(item => item.username)
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type:  chartType.value,
                    data:  userBookingData.value?.map(item => {
                        return {
                            name: item.username,
                            value: item.bookingCount
                        }
                    })
                }
            ]
        });
  }

  function renderChart2() {
      const myChart = echarts.init(chartsRef2.value);
        myChart.setOption({
            title: {
                text: '会议室预定情况'
            },
            tooltip: {},
            xAxis: {
                data: meetingRoomUsedData.value?.map(item => item.meetingRoomName)
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type:  chartType.value,
                    data:  meetingRoomUsedData.value?.map(item => {
                        return {
                            name: item.meetingRoomName,
                            value: item.usedCount
                        }
                    })
                }
            ]
        });
  }



    onMounted(() => {
      getStatisticData()
    })
</script>

<style scoped>

</style>
<route lang="yaml">
meta:
  layout: main
</route>
