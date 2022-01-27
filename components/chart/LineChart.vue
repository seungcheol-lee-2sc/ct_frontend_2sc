<template>
	<canvas ref="lineChart" class="lineChartStyle" width="400" height="130"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Chart, registerables } from 'chart.js';
import { ITwoDemensionData } from '~/types/common/types';

export interface ILineGraphDataSet {
	label: string;
	borderColor: string;
	data: ITwoDemensionData[];
	pointStyle: string;
	borderDash: number[];
	fill: boolean;
	gradient: boolean;
	tension: number;
}

export const DGraphTooltip = {
	intersect: false,
	mode: 'index',
	backgroundColor: '#9E9E9E',
	padding: '14',
	usePointStyle: true,
	itemSort: (a: any, b: any) => {
		return a?.dataset?.label > b?.dataset?.label ? -1 : 1;
	},
};

@Component
export default class LineChart extends Vue {
	$refs!: {
		lineChart: HTMLCanvasElement;
	};

	@Prop({ required: true }) datasets!: ILineGraphDataSet[];
	@Prop({ required: true }) displayX!: boolean;
	@Prop({ required: true }) gridX!: boolean;
	@Prop({ required: true }) displayY!: boolean;
	@Prop({ required: true }) gridY!: boolean;
	@Prop() hideFirstLabel!: boolean;

	chartCtx: CanvasRenderingContext2D | null = null;
	gradient: CanvasGradient | null = null;

	drawChart() {
		// gredient
		this.chartCtx = this.$refs.lineChart?.getContext('2d');
		if (this.chartCtx) {
			this.gradient = this.chartCtx.createLinearGradient(0, 0, 0, 250);
			this.gradient.addColorStop(0, '#B4E7DA');
			this.gradient.addColorStop(1, '#FFFFFF');

			const config: any = {
				type: 'line',
				data: {
					datasets: this.datasets.map(v => ({
						...v,
						borderWidth: 0.8,
						backgroundColor: v.gradient ? this.gradient : null,
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
							ticks: {
								maxRotation: 0,
								minRotation: 0,
								color: '#9E9E9E',
								callback(val: string | number, index: number, _ticks: string[]): string {
									// @ts-ignore
									return index === 0 ? '' : this.getLabelForValue(val);
								},
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
