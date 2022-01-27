<template>
	<span>
		<v-icon v-for="num in [1, 2, 3, 4, 5]" :key="num" :size="sizie" color="secondary">
			{{ star(num) }}
		</v-icon>
	</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class StarRating extends Vue {
	@Prop({ required: true }) rating!: number;
	@Prop({ required: true }) sizie!: number;

	get ceiled(): number {
		return Math.ceil(this.rating);
	}

	star(current: number): string {
		if (current <= this.rating) {
			return 'mdi-star';
		} else if (current > this.rating && current <= this.ceiled) {
			return 'mdi-star-half-full';
		} else {
			return 'mdi-star-outline';
		}
	}
}
</script>
