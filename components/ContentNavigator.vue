<template>
	<div class="navWrapper" :class="addtionalClass">
		<div class="navInner -shadow">
			<nav>
				<div class="navTitle">2022 Tax Guide</div>
				<div class="navContent">
					<ul v-for="(navItem, navItemIdx) in navItems" :key="navItem.top">
						<li :class="activationCalc(navItem, true) ? '-active' : {}" class="navItem" @click="goTo(navItem)">
							<span v-if="!hideNumbering"> {{ navItemIdx + 1 }}.0</span>
							{{ navItem.text }}
						</li>
					</ul>
				</div>
			</nav>

			<slot name="tail"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { GoToOptions } from 'vuetify/types/services/goto';

interface INavItem {
	element: HTMLElement;
	text: string;
	type: string;
	top: number;
	nextTop: number;
	children?: INavItem[];
}

const reformatting = (arr: HTMLElement[]): INavItem[] => {
	return arr
		.map((item: HTMLElement, idx: number) => ({
			element: item,
			text: (item.innerText && item.innerText.trim()) || '',
			type: item.tagName,
			top: item.offsetTop,
			nextTop: arr[idx + 1] ? arr[idx + 1].offsetTop : 999999,
		}))
		.filter(v => v.text);
};

const PARENT = 'H2';
// const CHILD = 'H3';
const OPTION: GoToOptions = { duration: 500, offset: 0, easing: 'easeInOutCubic' };

@Component
export default class ContentNavigator extends Vue {
	@Prop() rootClass!: string; // blog, tax-guide
	@Prop() hideNumbering!: boolean;
	@Prop() calculateEach!: boolean;
	@Prop() hideNavigation!: boolean;

	h2Arr: HTMLElement[] = [];
	// h3Arr: HTMLElement[] = [];
	navItems: INavItem[] = [];
	offsetTop: number = 0;

	get addtionalClass(): string {
		let result = '';

		result += this.rootClass || '';
		result += this.navItems.length > 0 && !this.hideNavigation ? ' -active ' : '';

		return result;
	}

	onScroll() {
		this.realign();
		this.offsetTop = window.pageYOffset;
	}

	goTo(navItem: INavItem) {
		this.$vuetify.goTo(navItem.element, OPTION);
	}

	beforeMount() {
		window.addEventListener('scroll', this.onScroll);
	}

	beforeDestroy() {
		window.removeEventListener('scroll', this.onScroll);
	}

	activationCalc(item: INavItem, parent: boolean = false): boolean {
		let nextTopOfParent = item.nextTop;
		if (this.calculateEach) {
			nextTopOfParent = item.children && item.children.length > 0 ? item.children[0].top : item.nextTop;
		}
		return parent
			? this.offsetTop >= item.top && this.offsetTop < nextTopOfParent
			: this.offsetTop >= item.top && this.offsetTop < item.nextTop;
	}

	realign() {
		const navItems: INavItem[] = reformatting(this.h2Arr).sort((a, b) => a.top - b.top);
		const reformedElements = navItems.map(navItem => {
			const foundIdx = navItems.findIndex(h2 => h2 === navItem);
			return {
				...navItem,
				nextTop: navItems[foundIdx + 1] ? navItems[foundIdx + 1].element.offsetTop : 999999,
			};
		});

		this.navItems = reformedElements;
	}

	mounted() {
		this.h2Arr = Array.prototype.slice.call(document.querySelectorAll(PARENT));
		this.realign();
	}
}
</script>

<style lang="scss" scoped>
.navWrapper {
	position: relative;
	display: block;
	height: 100%;
	max-height: 0;
	opacity: 0;
	transition: all 0.3s ease-in-out;

	&.-active {
		opacity: 1;
		max-height: 100%;
	}

	.navInner {
		position: sticky;
		top: 20px;
		width: 100%;
		border-radius: $round-lg;
		border: 1px solid $outline;
		// padding-bottom: 24px;
		// padding-top: 16px;
		// padding-left: 24px;
		// padding-right: 16px;

		.navTitle {
			margin-left: 18px;
			margin-right: 22px;
			padding-left: 4px;
			padding-top: 16px;
			color: $primary;
			padding-bottom: 22px;
			font-family: $poppins;
			border-bottom: 1px solid $outline;
		}

		// .navSubTitle {
		// 	font-family: $poppins;
		// 	font-weight: $font-medium;
		// 	font-size: 15px;
		// 	letter-spacing: 0.5px;
		// 	line-height: 1.6;
		// 	color: $secondary;
		// 	padding-top: 18px;
		// 	padding-left: 24px;
		// }

		.navContent {
			padding-top: 18px;

			padding-right: 16px;
		}

		nav {
			font-size: 16px;
			line-height: 2.25;

			ul {
				margin-bottom: 24px;
				line-height: 1.5 !important;
				list-style: none;

				.navItem {
					cursor: pointer;
				}
			}
		}
	}

	&.blog {
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 3 / span 3;
		}
		.navInner {
			nav {
				background-color: $offWhite;

				ul {
					li {
						margin-top: 12px;
					}
				}
			}
		}
	}

	&.tax-guide {
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 3 / span 3;
		}
		.navInner {
			nav {
				font-family: $poppins;
				color: $primaryLight;
				font-weight: $font-normal;
				letter-spacing: 0.5px;
				line-height: 1.47;

				ul {
					.navItem.-active {
						color: $secondary;
					}
				}
			}
		}
	}
}
</style>
