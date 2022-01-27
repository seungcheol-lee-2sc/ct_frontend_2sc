<template>
	<v-dialog :value="true" persistent max-width="500">
		<v-card class="dialogCardWrapper cardWrapper">
			<div style="margin-bottom: 20px">
				{{ $t('page.signIn.reconfirm.title1') }} <br />
				{{ $t('page.signIn.reconfirm.title2') }}
			</div>

			<div style="margin-bottom: 20px">
				<v-text-field :value="signInInfo.username" outlined readonly hide-details />
			</div>
			<div v-if="codeType">
				<v-text-field
					v-model.trim="code"
					:placeholder="$t('page.signIn.reconfirm.placeholder')"
					outlined
					append-outer-icon="mdi-refresh"
					:disabled="loading"
					@click:append-outer="sendConfirmation"
				/>
			</div>

			<div style="text-align: right">
				<v-btn v-if="!loading" style="margin-right: 4px" text color="error" @click="onClickClose">
					{{ $t('common.close') }}
				</v-btn>
				<v-btn v-if="codeType" depressed color="secondary" :disabled="loading" @click="confirmAccount">
					{{ loading ? `${$t('common.loading')}...` : $t('common.confirm') }}
				</v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { CONFIRM_SIGN_UP, SEND_CONFIRMATION, SIGN_IN } from '~/store/auth';
import { IConfirmSignUpDTO } from '~/types/auth/dto';
import { ISignIn } from '~/types/auth/types';
@Component
export default class NotConfirmedDialog extends Vue {
	@Prop({ required: true }) signInInfo!: ISignIn;
	@Prop({ required: true }) codeType!: boolean;

	code: string = '';
	loading: boolean = false;
	firstAccess: boolean = false;

	sendConfirmation() {
		this.code = '';
		this.$store.dispatch(`auth/${SEND_CONFIRMATION}`, this.signInInfo.username);
	}

	async confirmAccount() {
		if (!this.signInInfo.username) return;

		this.loading = true;
		const data: IConfirmSignUpDTO = { username: this.signInInfo.username, code: this.code };
		const success: boolean = await this.$store.dispatch(`auth/${CONFIRM_SIGN_UP}`, data);
		this.loading = false;

		if (!success) return;

		this.code = '';
		this.$emit('close');

		await this.$store.dispatch(`auth/${SIGN_IN}`, {
			username: this.signInInfo.username,
			password: this.signInInfo.password,
		});
	}

	onClickClose() {
		this.code = '';
		this.loading = false;
		this.$emit('close');
	}

	created() {
		if (this.firstAccess) return;
		this.sendConfirmation();
		this.firstAccess = true;
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	font-family: $poppins;
	padding: 24px;
	text-align: center;
}
</style>
