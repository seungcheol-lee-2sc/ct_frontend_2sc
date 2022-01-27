<template>
	<v-autocomplete
		ref="autocomplete"
		:value="value"
		maxlength="20"
		outlined
		:clearable="clearable"
		:label="label"
		:item-text="textKey"
		:item-value="valueKey"
		hide-details="auto"
		:disabled="disabled"
		:items="everyCountries"
		:background-color="backgroundColor"
		:return-object="returnObject"
		@change="onChange"
	>
		<template #selection="{ item }">
			<v-avatar style="margin-right: 4px" size="24">
				<v-img :src="getCountryIcon(item.code)" />
			</v-avatar>
			<template v-if="shownKey === 'phone'">+</template>
			{{ item[shownKey] }}
		</template>
		<template #item="{ item }">
			<v-avatar style="margin-right: 4px" size="24">
				<v-img :src="getCountryIcon(item.code)" />
			</v-avatar>
			<template v-if="shownKey === 'phone'">+</template>
			{{ item[shownKey] }}
			<template v-if="shownKey === 'phone'">
				{{ item.name }}
			</template>
		</template>
	</v-autocomplete>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { ICountryWithCode } from '~/types/common/types';
import { getCountryIcon, getEveryCountries } from '~/utils/application';

export type TCountrySelectorType = 'name' | 'code' | 'phone';

@Component
export default class CountrySelector extends Vue {
	@Prop({ required: true }) value!: any;
	@Prop({ required: true }) shownKey!: TCountrySelectorType;
	@Prop({ required: true }) textKey!: TCountrySelectorType;
	@Prop({ required: true }) valueKey!: TCountrySelectorType;
	@Prop() disabled!: boolean;
	@Prop() clearable!: boolean;
	@Prop() backgroundColor!: string;
	@Prop() returnObject!: boolean;
	@Prop() label!: string;

	everyCountries: ICountryWithCode[] = [];

	getCountryIcon = (code: string) => getCountryIcon(code);

	onChange(v: any) {
		this.$emit('change', v);
	}

	created() {
		this.everyCountries = getEveryCountries();
	}
}
</script>
