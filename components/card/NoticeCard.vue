<template>
	<OutlinedCard :bolder="true" :pad-x="16" :pad-y="24" :shadow="true">
		<div class="noticeWrapper">
			<img v-if="src" :src="src" />
			<div class="descText">
				<slot></slot>
			</div>
		</div>
	</OutlinedCard>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import OutlinedCard from './OutlinedCard.vue';

@Component({
	components: {
		OutlinedCard,
	},
})
export default class NoticeCard extends Vue {
	@Prop() src!: string;
}
</script>

<style lang="scss" scoped>
.noticeWrapper {
	padding-top: 48px;
	padding-bottom: 48px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 12px;

	.descText {
		line-height: 1.6;
		font-family: $poppins;
		font-weight: $font-medium;
		font-size: 23px;
	}
}
</style>
