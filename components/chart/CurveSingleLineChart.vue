<template>
	<canvas ref="curveChart" width="160" height="100" style="margin-right: 8px"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Chart, registerables } from 'chart.js';

@Component
export default class CurveSingleLineChart extends Vue {
	$refs!: {
		curveChart: HTMLCanvasElement;
	};

	@Prop({ required: true }) datas!: any[];
	@Prop({ required: true }) label!: string;
	@Prop({ required: true }) maxNum!: number;

	chartCtx: CanvasRenderingContext2D | null = null;
	gradient: CanvasGradient | null = null;

	get reformedData() {
		return this.datas.map(data => {
			data.x = `${new Date(data.time).getHours()}:${new Date(data.time).getMinutes()}`;
			data.y = data.price;
			delete data.time;
			delete data.price;
			return data;
		});
	}

	getAverage(array: number[]) {
		return array.reduce((a: number, b: number) => a + b) / array.length;
	}

	drawChart() {
		// gredient
		this.chartCtx = this.$refs.curveChart?.getContext('2d');
		if (this.chartCtx) {
			this.gradient = this.chartCtx.createLinearGradient(0, 0, 0, 95);
			this.gradient.addColorStop(0, '#96A6F4');
			this.gradient.addColorStop(1, '#FFFFFF');

			const config: any = {
				type: 'line',
				data: {
					datasets: [
						{
							label: this.label,
							backgroundColor: this.gradient,
							borderColor: 'rgba(17, 44, 168, 1)',
							borderWidth: 1,
							fill: true,
							data: this.reformedData,
							tension: 0.6,
							pointStyle: 'circle',
							pointBackgroundColor: 'rgba(17, 44, 168, 1)',
							pointBorderColor: 'rgba(255, 255, 255, 1)',
						},
					],
				},
				options: {
					responsive: false,
					interaction: {
						mode: 'index',
						intersect: false,
					},
					elements: {
						point: {
							radius: 0.1,
							hoverRadius: 7,
						},
					},
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							intersect: false,
							mode: 'index',
							backgroundColor: '#666666',
							padding: '14',
							usePointStyle: true,
						},
					},
					scales: {
						x: { display: false },
						y: { suggestedMin: 0, max: this.maxNum, display: false },
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
