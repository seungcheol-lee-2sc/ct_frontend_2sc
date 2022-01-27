<template>
	<section class="referSection">
		<div class="sectionWrapper">
			<h3 class="titleText">
				{{ $t('page.referSection.title') }} <br />
				<span class="text-white"> {{ $t('page.referSection.subTitle') }} </span>
			</h3>
			<LinkText color="primary" to="#" :inner-style="{ fontSize: '18px' }">{{ $t('page.referSection.link') }}</LinkText>
			<img class="people" src="/illust/people.png" alt="Talking people" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import LinkText from '~/components/text/LinkText.vue';

@Component({
	components: {
		LinkText,
	},
})
export default class ReferSection extends Vue {}
</script>

<style lang="scss" scoped>
.referSection {
	background-color: $mint;
	padding-top: 48px;
	padding-bottom: 200px;
	position: relative;
	overflow: hidden;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		text-align: left;
		padding-top: 60px;
		padding-bottom: 60px;
	}
}

.titleText {
	margin: auto;
	line-height: 1.5;
	max-width: 220px;
	font-size: 20px;
	font-family: $poppins;
	font-weight: $font-semibold;
	margin-bottom: 16px;
	letter-spacing: 0.25px;
	@media (min-width: #{$breakpoint-xl}) {
		font-size: 33px;
		max-width: none;
	}

	> span {
		letter-spacing: 0.25px;
	}
}

.people {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%) scale(1.2);
	width: 100%;
	max-width: fit-content;
	@media (min-width: #{$breakpoint-xl}) {
		left: 50%;
		transform: none;
	}
}
</style>
