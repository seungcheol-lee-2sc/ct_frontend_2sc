<template>
	<canvas ref="straightLineChart" style="padding: 16px 0"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Chart, registerables } from 'chart.js';

@Component
export default class StraightLineChart extends Vue {
	$refs!: {
		straightLineChart: HTMLCanvasElement;
	};

	@Prop({ required: true }) data!: any[];

	chartCtx: CanvasRenderingContext2D | null = null;
	gradient: CanvasGradient | null = null;

	drawChart() {
		// gredient
		this.chartCtx = this.$refs.straightLineChart?.getContext('2d');
		if (this.chartCtx) {
			const config: any = {
				type: 'line',
				data: {
					datasets: [
						{
							label: 'Worth',
							borderColor: 'rgba(238, 142, 54, 1)',
							borderWidth: 2,
							fill: false,
							data: this.data,
						},
					],
				},
				options: {
					responsive: true,
					interaction: {
						mode: 'index',
						intersect: false,
					},
					elements: {
						point: {
							radius: 0.1,
							hoverRadius: 5,
							backgroundColor: 'rgba(238, 142, 54, 1)',
							borderColor: 'rgba(0, 0, 0, 0.0)',
							pointStyle: 'circle',
						},
					},

					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							intersect: false,
							mode: 'index',
							backgroundColor: 'rgba(0, 0, 0, 0.2)',
							titleColor: 'rgba(238, 142, 54, 1)',
							bodyColor: 'rgba(238, 142, 54, 1)',
							displayColors: false,
							padding: '14',
							callbacks: {
								title() {},
								label: (tooltipItem: any) => {
									const label = `transactions: ${tooltipItem.formattedValue}` || '';
									return label;
								},
							},
						},
					},
					scales: {
						x: {
							display: false,
						},
						y: {
							display: false,
						},
					},
					layout: {
						padding: {
							top: 20,
							bottom: 20,
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
