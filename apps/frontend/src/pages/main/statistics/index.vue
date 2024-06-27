<template>
 <div class="p-20px">
        <div class="mb-40px">
            <Form
                name="search"
                layout='inline'
                :colon="false"
                @finish="getStatisticData"
            >
                <FormItem label="开始日期" name="startTime">
                    <DatePicker />
                </FormItem>

                <FormItem label="结束日期" name="endTime">
                    <DatePicker />
                </FormItem>

                <FormItem label="图表类型" name="chartType" :initialValue="'bar'">
                    <Select dropdownMenuStyle="width: 200px">
                        <SelectOption value="pie">饼图</SelectOption>
                        <SelectOption value="bar">柱形图</SelectOption>
                    </Select>
                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                </FormItem>
            </Form>
        </div>
        <div class="w-800px h-600px" ref="chartsRef">
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button, Form, FormItem, Select, DatePicker, SelectOption  } from "ant-design-vue";
import * as echarts from 'echarts';

  function getStatisticData(values: { startTime: string; endTime: string; }) {
        console.log(values);
    }

    const chartsRef = ref<HTMLDivElement | null>(null)

   function getChartData() {
      const myChart = echarts.init(chartsRef.value);
        myChart.setOption({
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
            ]
        });
    }

    onMounted(() => {
      getChartData()
    })
</script>

<style scoped>

</style>
<route lang="yaml">
meta:
  layout: main
</route>
