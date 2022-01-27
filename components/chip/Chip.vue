<template>
	<v-chip label :color="color" :text-color="fontcolor" small>
		<v-icon v-if="icon" class="chipIcon">{{ icon }}</v-icon>
		<slot></slot>
	</v-chip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Chip extends Vue {
	@Prop({ required: true }) color!: string;
	@Prop({ required: true }) fontcolor!: string;
	@Prop() icon!: string;
}
</script>

<style lang="scss" scoped>
.chipIcon {
	margin-right: 4px;
}
</style>
