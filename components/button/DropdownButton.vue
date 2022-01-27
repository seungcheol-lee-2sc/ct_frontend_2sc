<template>
	<v-menu offset-y :top="top">
		<template #activator="{ on, attrs }">
			<div v-bind="attrs" class="dropdownButton" :class="addtionalClass" v-on="on">
				<div class="left">
					<slot></slot>
				</div>
				<div class="right" :class="`border-${color}`">
					<v-icon v-if="top" :color="color">mdi-menu-up</v-icon>
					<v-icon v-else :color="color">mdi-menu-down</v-icon>
				</div>
			</div>
		</template>
		<ProductMenuList :product-menu-list="list || []" :value="value" />
	</v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import ProductMenuList, { IProductMenuList } from '~/components/list/ProductMenuList.vue';

@Component({
	components: {
		ProductMenuList,
	},
})
export default class DropdownButton extends Vue {
	@Prop({ required: true }) color!: string;
	@Prop() top!: boolean;
	@Prop({ required: true }) list!: IProductMenuList[];
	@Prop() value!: any;

	get addtionalClass(): string {
		let result = '';

		result += this.color ? `border-${this.color} ` : '';

		return result;
	}
}
</script>

<style lang="scss" scoped>
.dropdownButton {
	cursor: pointer;
	border-radius: $round-xs;
	color: $primary;
	border: 1px solid $primary;
	font-size: 14px;
	font-weight: $font-medium;
	font-family: $poppins;
	letter-spacing: 0.25px;
	display: flex;
	align-items: center;
	transition: all 0.2s ease-in-out;
	&:hover {
		background-color: $offWhite;
	}

	.left {
		padding: 8px 12px;
	}

	.right {
		padding: 10px;
		border-left: 1px solid $primary;
	}
}
</style>
