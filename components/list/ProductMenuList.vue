<template>
	<v-list style="padding: 8px" :dense="dense">
		<v-menu
			v-for="listItem in productMenuList"
			:key="`product-list-${listItem.text}`"
			:open-on-hover="hoverable(listItem)"
			offset-x
		>
			<template #activator="{ on, attrs }">
				<v-list-item
					v-bind="hoverable(listItem) ? attrs : null"
					:dense="dense"
					class="listItem"
					:class="addtionalClass(listItem)"
					v-on="hoverable(listItem) ? on : null"
					@click="onClickPrentListItem(listItem)"
				>
					<!-- List -->
					<v-icon v-if="listItem.icon" :color="listItem.color" class="viconList">{{ listItem.icon }}</v-icon>
					<v-img v-else-if="listItem.img" :src="listItem.img" class="vimgList" max-width="24" />
					<v-icon v-else-if="defaultImage" class="viconDefaultImage">mdi-image</v-icon>

					<div :class="textClass(listItem)" class="ListItemText">
						{{ listItem.text }}
						<v-icon v-if="listItem.newTab" small :color="listItem.color">mdi-open-in-new</v-icon>
					</div>
					<v-icon v-if="hoverable(listItem)" style="position: absolute; right: 0">mdi-menu-right</v-icon>
					<!-- /List -->
				</v-list-item>
				<span class="closingParent"></span>
			</template>
			<v-list v-if="hoverable(listItem)" style="padding: 8px">
				<v-list-item
					v-for="subListItem in listItem.subList"
					:key="`sub-product-list-${subListItem.text}`"
					class="listItem"
					:class="addtionalClass(subListItem)"
					@click="onClickChild(subListItem)"
				>
					<!-- List -->
					<v-icon v-if="subListItem.icon" :color="subListItem.color" class="viconList">{{ subListItem.icon }}</v-icon>
					<v-img v-else-if="subListItem.img" :src="subListItem.img" class="vimgList" max-width="24" />
					<v-icon v-else-if="defaultImage" class="viconList">mdi-image</v-icon>

					<div :class="textClass(subListItem)" class="textClassWrapper">
						{{ subListItem.text }}
						<v-icon v-if="subListItem.newTab" small :color="subListItem.color">mdi-open-in-new</v-icon>
					</div>
					<!-- /List -->
				</v-list-item>
			</v-list>
		</v-menu>
	</v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

export interface IProductMenuList {
	text: string | any;
	color: string;
	onclick: () => any;
	icon?: string;
	img?: string;
	fixStyle?: boolean;
	newTab?: boolean;
	disabled?: boolean;
	origin?: any;
	border?: boolean;
	subList?: IProductMenuList[];
	clickOnly?: boolean;
}

@Component
export default class ProductMenuList extends Vue {
	@Prop({ required: true }) productMenuList!: IProductMenuList[];
	@Prop() dense!: boolean;
	@Prop() defaultImage!: boolean;
	@Prop() value!: any;
	@Prop() twoDepth!: boolean;

	onClickPrentListItem(listItem: IProductMenuList) {
		listItem.onclick();
	}

	onClickChild(subListItem: IProductMenuList) {
		document.querySelectorAll('.closingParent').forEach(e => {
			// @ts-ignore
			e.click();
		});
		subListItem.onclick();
	}

	hoverable(menuList: IProductMenuList): boolean {
		return this.twoDepth && !menuList.clickOnly;
	}

	addtionalClass(listItem: IProductMenuList): string {
		let result = '';
		result += listItem.fixStyle ? '' : '-no-fix ';
		result += listItem.disabled ? ' unused ' : 'used ';
		result += listItem.border ? ` listItemBorder border-${listItem.color || 'outline'} ` : '';
		result += this.value === listItem.text ? ' -active' : '';
		return result;
	}

	textClass(listItem: IProductMenuList): string {
		let result = '';
		result += listItem.color ? ` text-${listItem.color} ` : '';
		result += this.hoverable(listItem) ? ' hoverableListItem ' : '';
		if (this.value && typeof this.value === 'string' && listItem.text) {
			result +=
				this.value.replace(/\s/g, '').toLowerCase() === listItem.text.replace(/\s/g, '').toLowerCase()
					? ' replaceToLowerCase '
					: '';
		}
		return result;
	}
}
</script>

<style lang="scss" scoped>
.listItem {
	&.unused {
		cursor: default;
		color: $disabled;
	}
	&.used {
		&:hover {
			background-color: $secondaryPale !important;
		}
	}
	&.used.-no-fix {
		&:hover {
			div,
			i {
				color: $primary !important;
			}
		}
	}
	&.-active {
		font-weight: $font-bold;
	}

	.viconList,
	.vimgList,
	.viconDefaultImage {
		margin-right: 16px;
	}

	.ListItemText,
	.textClassWrapper {
		white-space: nowrap;
	}
}

.listItemBorder {
	border-top-width: 1px;
}
.hoverableListItem {
	padding-right: 8px;
}
.replaceToLoverCase {
	font-weight: 700;
}
</style>
