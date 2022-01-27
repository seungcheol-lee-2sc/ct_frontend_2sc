<template>
	<Button
		:id="buttonId"
		style="position: relative; z-index: 222"
		:color="green ? 'secondary' : 'primary'"
		:rounded="true"
		fontcolor="white"
		:fontsize="fontsize"
		:height="height"
		:width="width || null"
		@click="$vuetify.goTo('#count-me-in', {})"
	>
		{{ $t('page.main.section1.button') }}
	</Button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import Button from './Button.vue';

@Component({
	components: {
		Button,
	},
})
export default class CountMeInButton extends Vue {
	@Prop() width!: number;
	@Prop({ required: true }) height!: number;
	@Prop({ required: true }) fontsize!: number;
	@Prop() green!: boolean;
	@Prop() buttonId!: string;
}
</script>
