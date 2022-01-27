<template>
	<canvas ref="chart" class="doughnutChart"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Chart, registerables } from 'chart.js';
import { roundingNumber } from '~/utils/number';
import { reformedAmountValue } from '~/utils/application';

const COLORS = [
	'#71D2C9',
	'#FCD801',
	'#6B5B95',
	'#88B04B',
	'#FDA06D',
	'#92A8D1',
	'#9C77EC',
	'#74C8EC',
	'#FF878F',
	'#FACD90',
	'#95706D',
	'#C4C4C4',
	'#666666',
];

@Component
export default class DoughnutChart extends Vue {
	$refs!: {
		chart: HTMLCanvasElement;
	};

	@Prop({ required: true }) data!: number[];
	@Prop({ required: true }) labels!: string[];
	@Prop({ required: true }) width!: number;
	@Prop() random!: boolean;

	round(inputNumber: string | number, pow: number = 2) {
		return roundingNumber(inputNumber, pow);
	}

	chartCtx: CanvasRenderingContext2D | null = null;
	backgroundColors: string[] = [];
	// shuffledColors = shufflingArray(COLORS);

	get overOnePercentData(): number[] {
		const totalSum = this.data.reduce((a, b) => a + b);
		const overOnePercentData: number[] = [];
		const belowOnePercentData: number[] = [];
		this.data.forEach(v => {
			const calResult = (v / totalSum) * 100;
			calResult > 1 ? overOnePercentData.push(v) : belowOnePercentData.push(v);
		});
		const otherValue = belowOnePercentData.reduce((a, b) => a + b);
		return [...overOnePercentData, otherValue];
	}

	get overOnePercentLabels(): string[] {
		const newLabels = this.labels.slice(0, this.overOnePercentData.length - 1);
		return [...newLabels, 'Others'];
	}

	drawChart() {
		this.chartCtx = this.$refs.chart?.getContext('2d');
		if (this.chartCtx) {
			const config: any = {
				type: 'doughnut',
				data: {
					labels: this.overOnePercentLabels,
					datasets: [
						{
							data: this.overOnePercentData,
							backgroundColor: this.backgroundColors,
						},
					],
				},
				options: {
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							intersect: false,
							titleColor: 'rgba(238, 142, 54, 1)',
							padding: '14',
							callbacks: {
								label: (TooltipItem: any) => {
									const value = reformedAmountValue(TooltipItem.raw) || '';
									const label = `${TooltipItem.label}: ${value}`;
									return label;
								},
							},
						},
					},
					cutout: `${this.width}%`,
					responsive: false,
				},
			};

			Chart.register(...registerables);
			return new Chart(this.chartCtx, config);
		}
	}

	mounted() {
		this.drawChart();
	}

	created() {
		if (this.random) {
			this.backgroundColors = Array(1000)
				.fill(null)
				.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`); // random colors
		} else {
			const tailArr = Array(500).fill(COLORS[COLORS.length - 1]);
			this.backgroundColors = [...COLORS, ...tailArr];
		}

		this.$emit('colors', this.backgroundColors);

		console.log(this.overOnePercentData);
		console.log(this.overOnePercentLabels);
	}
}
</script>
<style lang="scss" scoped></style>
