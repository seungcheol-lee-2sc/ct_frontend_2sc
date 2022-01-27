<template>
	<canvas ref="chartElement" class="lineChartStyle" width="400" height="130"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Chart, registerables } from 'chart.js';
import { DGraphTooltip } from './LineChart.vue';
import { ITwoDemensionData } from '~/types/common/types';

export interface IBarGraphDataSet {
	label: string;
	data: ITwoDemensionData[];
}

@Component
export default class BarChart extends Vue {
	$refs!: {
		chartElement: HTMLCanvasElement;
	};

	@Prop({ required: true }) datasets!: IBarGraphDataSet[];
	@Prop({ required: true }) displayX!: boolean;
	@Prop({ required: true }) gridX!: boolean;
	@Prop({ required: true }) displayY!: boolean;
	@Prop({ required: true }) gridY!: boolean;
	@Prop() hideFirstLabel!: boolean;

	chartCtx: CanvasRenderingContext2D | null = null;
	gradient: CanvasGradient | null = null;

	drawChart() {
		// gredient
		this.chartCtx = this.$refs.chartElement?.getContext('2d');
		if (this.chartCtx) {
			const config: any = {
				type: 'bar',
				data: {
					datasets: this.datasets.map(v => ({
						...v,
						borderWidth: 0.8,
						borderColor: '#00BFA5',
						backgroundColor: 'rgba(0, 191, 165, 0.8)',
					})),
				},
				options: {
					interaction: {
						mode: 'index',
						intersect: false,
					},
					elements: {
						point: {
							radius: 0.1,
						},
					},
					plugins: {
						legend: {
							display: false,
						},
						tooltip: DGraphTooltip,
					},
					scales: {
						x: {
							display: this.displayX,
							grid: {
								display: this.gridX,
							},
						},
						y: {
							display: this.displayY,
							grid: {
								display: this.gridY,
							},
						},
					},
				},
			};

			Chart.register(...registerables);
			return new Chart(this.chartCtx, config);
		}
	}

	mounted() {
		this.drawChart();
	}
}
</script>
<style lang="scss" scoped>
.lineChartStyle {
	margin-left: -5px;
	margin-right: -5px;
	width: 110%;
}
</style>
