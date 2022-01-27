<template>
	<v-dialog v-model="dialog" persistent max-width="500">
		<v-card class="dialogCardWrapper cardWrapper">
			<template v-if="!additionalInfo">
				<div class="titleText">
					{{ $t('welcome.country.title') }}
				</div>
				<div class="suttitleText">{{ $t('welcome.country.desc') }}</div>
				<div style="margin-top: 24px">
					<CountrySelector
						v-model="country"
						style="margin-bottom: 24px"
						:label="$t('welcome.country.placeholder')"
						:disabled="loading"
						:clearable="true"
						text-key="name"
						shown-key="name"
						value-key="code"
						@change="v => (country = v)"
					/>
				</div>
				<div class="buttonsWrapper -right" style="margin-top: 8px">
					<Button
						:disabled="!country || loading"
						:text="true"
						color="primary"
						:loading="loading"
						@click="onClickContinue"
					>
						{{ $t('common.continue').toUpperCase() }}
					</Button>
				</div>
			</template>
			<template v-else>
				<div style="padding: 24px 0">
					<v-img src="/characters/on-earth.png" width="160px" style="margin: 0 auto" />
					<div class="warningTitle">{{ $t('welcome.country.warn.title') }}</div>
					<div class="warningContent">{{ $t('welcome.country.warn.desc') }}:</div>
					<div>
						<ul class="features">
							<li>{{ $t('welcome.country.warn.feature1') }}</li>
							<li>{{ $t('welcome.country.warn.feature2') }}</li>
							<li>{{ $t('welcome.country.warn.feature3') }}</li>
							<li>{{ $t('welcome.country.warn.feature4') }}</li>
						</ul>
					</div>
					<div>
						<CardButton
							:msg="$t('common.gotIt')"
							:loading="loading"
							color="secondary"
							@click.native="saveCountry(country)"
						/>
					</div>
				</div>
			</template>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Getter, Prop, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import CountrySelector from '../select/CountrySelector.vue';
import { UPDATE_ATTRIBUTES } from '~/store/auth';
import { CONFIRM_ERROR, ADD_TO_MESSAGE_QUEUE } from '~/store';
import { SERVICEABLE_COUNTRIES } from '~/utils/constants';
import CardButton from '~/components/button/CardButton.vue';
import { ICognitoUserExt } from '~/types/auth/types';

@Component({
	components: {
		Button,
		CardButton,
		CountrySelector,
	},
})
export default class CountryDialog extends Vue {
	$refs!: {
		autocomplete: any;
	};

	@Prop({ required: true }) dialog!: boolean;

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	country: string = '';
	loading: boolean = false;
	additionalInfo: boolean = false;

	@Getter(`auth/thereIsCountry`) thereIsCountry!: boolean;

	onClickContinue() {
		if (this.country) {
			if (SERVICEABLE_COUNTRIES.includes(this.country)) {
				this.saveCountry(this.country);
			} else {
				this.additionalInfo = true;
			}
		} else {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.notFoundTarget', { target: this.$t('product.countryCode') }),
			});
		}
	}

	async saveCountry(countryCode: string) {
		if (!countryCode) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: this.$t('message.notFoundTarget', { target: this.$t('product.countryCode') }),
			});
			return;
		}
		this.loading = true;
		const res = await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, {
			'custom:tax_country': countryCode,
			'custom:phone_country': countryCode,
		});
		!res &&
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: `${this.$t('message.fail.update')}. ${this.$t('message.tryAgain')}`,
			});
		this.loading = false;
		this.$emit('close');
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	font-family: $poppins;
	padding: 24px;
	text-align: center;

	.titleText {
		color: $primary;
		font-size: 19px;
		font-weight: $font-medium;
		font-family: $poppins;
		text-align: left;
	}
	.suttitleText {
		font-size: 14px;
		font-family: $roboto;
		color: $primaryLight;
		text-align: left;
	}

	.warningTitle {
		margin-top: 13px;
		margin-bottom: 15px;
		font-weight: $font-medium;
		font-family: $poppins;
		font-size: 16px;

		@media (min-width: #{$breakpoint-xl}) {
			font-size: 19px;
		}
	}
	.warningContent {
		font-family: $roboto;
		font-weight: $font-normal;
		font-size: 13px;
		color: $primaryLight;
		padding-left: 0;
		padding-right: 0;
		text-align: left;
		letter-spacing: 0.25px;
		line-height: 1.85;
		@media (min-width: #{$breakpoint-xl}) {
			padding-left: 32px;
			padding-right: 32px;
			font-size: 14px;
		}
	}
	.features {
		padding-left: 0 !important;
		line-height: 1;
		text-align: left;
		display: inline-block;
		list-style: disc;
		margin-top: 32px;
		margin-bottom: 32px;
		line-height: 1.85;
		color: $primaryLight;
		@media (min-width: #{$breakpoint-xl}) {
			margin-top: 40px;
			margin-bottom: 40px;
		}

		li {
			margin-bottom: 8px;
		}
	}
}
</style>
