<template>
	<v-card class="importCard" :class="noPad ? '' : '-pad'" color="white" elevation="0">
		<!-- title -->
		<div class="topWrap">
			<span v-if="title" class="titleText">
				{{ title }}
				<slot name="appendButton"></slot>
			</span>

			<slot name="button"></slot>
		</div>

		<!-- content slot -->
		<div class="contentWrapper">
			<slot></slot>
		</div>
	</v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';

@Component({
	components: {
		Button,
	},
})
export default class ImportCard extends Vue {
	@Prop() title!: string;
	@Prop() url!: string;
	@Prop() noPad!: boolean;
	@Prop() button!: boolean;

	onClickButton() {
		this.$emit('onClick');
	}
}
</script>

<style lang="scss" scoped>
.importCard {
	&.-pad {
		padding: 24px;
	}
	.topWrap {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.titleText {
			font-size: 19px;
			font-weight: $font-medium;
			font-family: $poppins;
			display: flex;
			align-items: center;
			gap: 8px;
		}
	}

	.contentWrapper {
		margin-top: 36px;
	}
}
</style>
