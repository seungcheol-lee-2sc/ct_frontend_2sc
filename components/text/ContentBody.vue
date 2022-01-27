<template>
	<article class="postBody" v-html="post"></article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { getSingleItem } from '~/utils/func';
import { filteringHTML } from '~/utils/string';

@Component
export default class ContentBody extends Vue {
	@Prop({ required: true }) post!: string;

	filteringHTML = (html: string) => filteringHTML(getSingleItem(html));
}
</script>

<style lang="scss">
@mixin h2Style {
	font-size: 36px;
	font-weight: $font-semibold;
	letter-spacing: -0.5px;
	line-height: 1.33;
	color: $secondary;
	word-break: keep-all;
}

.postBody {
	> h2 {
		color: $primary;
		font-size: 19px;
		font-family: $poppins;
		@media (min-width: #{$breakpoint-xl}) {
			font-size: 36px;
			line-height: 1.33;
			letter-spacing: -0.5px;
			font-weight: $font-medium;
			margin-bottom: 40px;
		}

		@include h2Style();
		> span {
			> strong {
				@include h2Style();
			}
		}
	}

	> h3 {
		word-break: keep-all;
		margin-bottom: 8px;
		> span {
			> strong {
				color: $primary;
				font-size: 30px;
				font-family: $poppins;
				font-weight: $font-semibold;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 30px;
					letter-spacing: -0.5px;
					line-height: 1.4;
				}
			}
		}
	}

	> h4 {
		word-break: keep-all;
		> span {
			> strong {
				color: $primary;
				font-size: 20px;
				font-family: $roboto;
				font-weight: $font-medium;
				@media (min-width: #{$breakpoint-xl}) {
					font-size: 24px;
					letter-spacing: 0.5px;
					line-height: 1.5;
					font-weight: $font-normal;
				}
			}
		}
	}

	> p {
		word-break: keep-all;
		font-weight: $font-normal;
		font-size: 16px;
		padding-bottom: 16px;

		margin: 0;
		color: $primaryLight;
		line-height: 2;
		letter-spacing: 0.5px;
		font-family: $roboto;

		@media (min-width: #{$breakpoint-xl}) {
			font-size: 18px;
			// padding-bottom: 31px;
			padding-bottom: 40px;
		}
		> span {
			font-size: 18px;
			font-family: $roboto;
			letter-spacing: 0.5px;
			line-height: 1.5;
			color: $primaryLight;
			> strong {
				color: $primary;
				font-size: 18px;
				letter-spacing: 0.5px;
				line-height: 2;
				font-weight: $font-semibold;
			}
		}
	}

	blockquote {
		word-break: keep-all;
		background-color: $lightGrey;
		padding: 19px 61px 24px 24px;
		font-family: $roboto;

		margin-bottom: 10px;
		border-radius: $round-md;
		@media (min-width: #{$breakpoint-xl}) {
			padding-bottom: 24px;
		}

		h1,
		h2,
		h3,
		h4 {
			word-break: keep-all;
			font-size: 15px;
			font-weight: $font-medium;
			margin-bottom: 12px;
			font-family: $poppins;
			color: $primaryPale;
		}

		> p {
			word-break: keep-all;
			font-size: 16px;
			font-weight: $font-normal;
			line-height: 1.625;
			&:first-child {
				margin-bottom: 10px !important;
			}
		}

		strong {
			font-family: $poppins;
			font-weight: $font-medium;
		}

		a,
		u {
			text-decoration: none;
		}
	}

	ul li {
		list-style: disc;
		line-height: 2;
	}

	table {
		width: 100%;
		text-align: center;
		font-size: 13px;
		@media (min-width: #{$breakpoint-xl}) {
			table-layout: fixed;
			font-size: 16px;
		}

		td {
			word-break: keep-all;
			padding: 8px 4px;
			border: 1px solid $outline;
			font-size: 12px;
			@media (min-width: #{$breakpoint-xl}) {
				padding: 16px 8px;
				font-size: 16px;
			}
		}
	}

	a,
	u {
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
}
</style>
