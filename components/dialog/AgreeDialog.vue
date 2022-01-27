<template>
	<v-dialog v-model="dialog" persistent max-width="500">
		<v-card class="dialogCardWrapper cardWrapper">
			<div class="titleText" v-html="$t('welcome.agree.title')"></div>

			<img class="smile" src="/characters/laugh-3.png" />
			<img class="pig-tail" src="/lines/pig-tail-line-1.png" />

			<div class="contentWrapper">
				<div class="checkboxLine" style="margin-bottom: 8px">
					<span v-html="agreementText"> </span>
				</div>

				<div class="checkboxLine">
					<Checkbox v-model="subscribe" :disabled="loading" color="primary" @click="subscribe = !subscribe" />
					<span>{{ $t('welcome.agree.checkbox2') }}</span>
				</div>
			</div>

			<div class="buttonsWrapper">
				<Button
					:rounded="true"
					color="primary"
					fontcolor="white"
					:height="44"
					:width="142"
					:block="isMobile"
					:disabled="loading"
					:loading="loading"
					class="submitButton"
					@click="onSubmit"
				>
					{{ $t('common.next') }}
				</Button>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import Checkbox from '../input/Checkbox.vue';
import { UPDATE_ATTRIBUTES } from '~/store/auth';
import CardButton from '~/components/button/CardButton.vue';
import { ICognitoUserExt, EBoolean } from '~/types/auth/types';
import AlertCard from '~/components/card/AlertCard.vue';
import { generateAgreementText } from '~/utils/application';

@Component({
	components: {
		CardButton,
		AlertCard,
		Button,
		Checkbox,
	},
})
export default class CountryDialog extends Vue {
	$refs!: {
		autocomplete: any;
	};

	@Prop({ required: true }) dialog!: boolean;
	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	subscribe: boolean = false;
	loading: boolean = false;

	get agreementText(): any {
		return generateAgreementText(this, 'welcome.agree.agreement', 'link');
	}

	async onSubmit() {
		const attributes = {
			'custom:is_newsletter_subd': this.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_promo_email_subd': this.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_notice_email_subd': this.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_notice_text_subd': this.subscribe ? EBoolean.TRUE : EBoolean.FALSE,
		};
		this.loading = true;
		const res = await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, attributes);
		res && this.$emit('close');
		this.loading = false;
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	position: relative;
	font-family: $poppins;
	text-align: center;

	.titleText {
		margin-bottom: 204px;
		font-size: 19px;
		font-weight: $font-medium;
		text-align: center;
		letter-spacing: 0.15px;
		line-height: 1.55;
	}

	.smile {
		position: absolute;
		right: 0;
		top: 160px;
	}

	.pig-tail {
		position: absolute;
		left: 0;
		top: 128px;
	}

	.contentWrapper {
		margin-top: 32px;
		margin-bottom: 24px;

		.checkboxLine {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 8px;
			text-align: left;
			font-size: 14px;
			color: $primaryLight;
			padding-right: 10px;
			a {
				color: $primary;
				text-decoration: underline;
			}
		}
	}

	.submitButton {
		margin-top: 20px;
	}
}
</style>
