<template>
	<v-autocomplete
		ref="autocomplete"
		v-model="selectedTimezone"
		clearable
		:placeholder="$t('placeholder.timezone')"
		:label="$t('product.timezone')"
		outlined
		:hide-details="hideDetails || false"
		:items="timeZoneLists"
		item-text="shownName"
		return-object
		:rules="required ? requiredRules : [true]"
		:dense="dense || false"
		style="max-width: 320px"
		auto-select-first
		:disabled="disabled"
		@change="onChangeTimezone"
	>
		<template #append-outer>
			<ToolitipItem v-if="tooltip" :bottom="true" :rounded="true">
				{{ tooltip }}
			</ToolitipItem>
		</template>
	</v-autocomplete>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import { ITimeZone } from '~/types/common/types';
import { requiredRule } from '~/utils/rules';
import ToolitipItem from '~/components/tooltip/TooltipItem.vue';

export enum ETimezoneInitType {
	LOCAL = 'LOCAL',
	UTC = 'UTC',
	NONE = 'NONE',
}

@Component({
	components: {
		ToolitipItem,
	},
})
export default class TimezoneSelector extends Vue {
	$refs!: {
		autocomplete: any;
	};

	@Prop({ required: true }) initValue!: any;
	@Prop() dense!: boolean;
	@Prop() tooltip!: string;
	@Prop() required!: boolean;
	@Prop() hideDetails!: boolean;
	@Prop() disabled!: boolean;

	@State(state => state.timeZoneLists) timeZoneLists!: ITimeZone[];
	selectedTimezone: ITimeZone | null = null;
	requiredRules = [(v: any) => requiredRule(v)];

	onChangeTimezone() {
		this.$refs.autocomplete.blur();
		this.$emit('onchange', this.selectedTimezone);
	}

	created() {
		this.selectedTimezone = this.initValue;
	}
}
</script>
