<template>
	<v-tooltip :bottom="bottom" :top="top" :left="left" :right="right">
		<template #activator="{ on }">
			<v-hover v-slot="{ hover }">
				<span style="padding: 1px; cursor: pointer" v-on="on">
					<v-icon :color="hover ? 'secondaryLight' : defaultColor" :small="small">
						{{ rounded ? 'mdi-help-circle-outline' : 'mdi-help-circle' }}
					</v-icon>
				</span>
			</v-hover>
		</template>
		<slot></slot>
	</v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class TooltipItem extends Vue {
	@Prop() bottom!: boolean;
	@Prop() top!: boolean;
	@Prop() left!: boolean;
	@Prop() right!: boolean;
	@Prop() small!: boolean;
	@Prop() rounded!: boolean;
	@Prop() color!: string;

	get defaultColor(): string {
		return this.color || 'disabled';
	}
}
</script>
