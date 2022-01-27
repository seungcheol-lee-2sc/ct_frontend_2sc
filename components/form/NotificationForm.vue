<template>
	<v-form ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
		<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

		<div class="formContentWrapper">
			<div class="agreeCheckbox">
				<Checkbox
					v-model="promotion"
					color="primary"
					:disabled="!editMode || loading"
					@click="promotion = !promotion"
				/>
				<div class="notification">{{ $t('page.profile.notification.item1') }}</div>
			</div>
			<div class="agreeCheckbox">
				<Checkbox
					v-model="newletter"
					color="primary"
					:disabled="!editMode || loading"
					@click="newletter = !newletter"
				/>
				<div class="notification">{{ $t('page.profile.notification.item2') }}</div>
			</div>
		</div>
		<div class="formBtnWrapper -wide">
			<Button
				:rounded="true"
				:color="editMode ? 'disabled' : 'primary'"
				:disabled="loading"
				:text="true"
				:height="44"
				:fontsize="14"
				@click="editMode = !editMode"
			>
				{{ $t('common.edit') }}
			</Button>

			<Button
				:rounded="true"
				fontcolor="white"
				:loading="loading"
				:disabled="!editMode || loading"
				color="primary"
				:width="122"
				:height="44"
				:fontsize="14"
				type="submit"
			>
				{{ $t('common.save') }}
			</Button>
		</div>
	</v-form>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import Checkbox from '../input/Checkbox.vue';
import { UPDATE_ATTRIBUTES } from '~/store/auth';
import { ICognitoUserExt, EBoolean } from '~/types/auth/types';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import AlertCard from '~/components/card/AlertCard.vue';
import Button from '~/components/button/Button.vue';

@Component({
	components: {
		AlertCard,
		Button,
		Checkbox,
	},
})
export default class NotificationForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;

	formValid: boolean = false;
	errorMsg: string | any = '';
	loading: boolean = false;
	editMode: boolean = false;

	newletter: boolean = false;
	promotion: boolean = false;
	notice: boolean = false;

	get submitData() {
		return {
			'custom:is_newsletter_subd': this.newletter ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_promo_email_subd': this.promotion ? EBoolean.TRUE : EBoolean.FALSE,
			'custom:is_notice_email_subd': this.notice ? EBoolean.TRUE : EBoolean.FALSE,
		};
	}

	async onSubmitForm() {
		if (this.formValid) {
			this.loading = true;
			this.errorMsg = '';
			const res = await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, this.submitData);
			res &&
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
			this.loading = false;
			this.editMode = false;
		} else {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form.validate();
		}
	}

	init() {
		// @ts-ignore
		const attributes: IAttributes = this.user.attributes;

		if (attributes) {
			this.newletter = attributes['custom:is_newsletter_subd'] === EBoolean.TRUE;
			this.promotion = attributes['custom:is_promo_email_subd'] === EBoolean.TRUE;
			this.notice = attributes['custom:is_notice_email_subd'] === EBoolean.TRUE;
		} else {
			this.errorMsg = this.$t('message.fail.fetch');
		}
	}

	created() {
		this.init();
	}
}
</script>

<style lang="scss" scoped>
.agreeCheckbox {
	display: flex;
	align-items: center;
	gap: 12px;

	.notification {
		font-size: 14px;
		color: $primary;
	}
}
</style>
