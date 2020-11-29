<template>
  <e-charts
    ref="pie"
    style="width: 100%"
    autoresize
    :options="thePie"
    auto-resize
  />
</template>

<script>
export default {
  data() {
    return {
      pie:{
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Blog Referral', 'Newsletter Users', 'Email Forwarding', 'Referral links', 'Eating pie']
        },
        series: [
          {
            name: 'Access source',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            color: ['#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0'],
            data: [
              { value: 335, name: 'Blog Referral' },
              { value: 310, name: 'Newsletter Users' },
              { value: 234, name: 'Email Forwarding' },
              { value: 135, name: 'Referral links' },
              { value: 1548, name: 'Eating pie' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    thePie () {
      const aPie = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.$store.state.queryuser.pieChartValues
        },
        series: [
          {
            name: 'Bhai Thamen',
            type: 'pie',
            radius: '70%',
            center: ['50%', '60%'],
            color: ['#FF9F43','#28C76F','#EA5255','#87ceeb','#7367F0',
              '#7117F0', '#2367F0', '#1004F0','#E367F0','#FF1F13'],
            data: this.$store.state.queryuser.pieChartValues,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      return aPie
    }

  },
  mounted () {
    let dataIndex = -1
    const { pie } = this.$refs
    const dataLen = pie.options.series[0].data.length

    setInterval(() => {
      pie.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex
      })
      dataIndex = (dataIndex + 1) % dataLen
      pie.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex
      })
      pie.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex
      })
    }, 10000)
  }
}
</script>
