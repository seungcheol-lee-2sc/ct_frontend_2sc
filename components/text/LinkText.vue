<template>
	<nuxt-link v-if="to" class="linkText" :class="innerClass" :to="to" :style="innerStyle || {}">
		<span
			:class="color ? `text-${color}` : 'text-link'"
			:style="textSize ? `font-size:${textSize}px` : `font-size:18px`"
		>
			<slot></slot>
			<v-icon class="linkIcon" :color="color || 'link'">mdi-chevron-right</v-icon>
		</span>
	</nuxt-link>
	<a
		v-else
		class="linkText"
		:class="color ? `text-${color}` : 'text-link'"
		:style="textSize ? `font-size:${textSize}px` : `font-size:18px`"
		@click.stop="$emit('click')"
	>
		<slot></slot>
		<v-icon class="linkIcon" :color="color || 'link'">mdi-chevron-right</v-icon>
	</a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class LinkText extends Vue {
	@Prop() innerClass!: string;
	@Prop() innerStyle!: any;
	@Prop({ required: true }) to!: string;
	@Prop() color!: string;
	@Prop() textSize!: number;
}
</script>

<style lang="scss" scoped>
.linkText {
	position: relative;
	cursor: pointer;

	.linkIcon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: -24px;
	}
}
</style>
