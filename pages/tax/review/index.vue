<template>
	<div>
		<div class="reviewTitle">Review</div>

		<div class="wrapper728">
			<div class="autoReviewCard">
				<div class="titleText">Auto Review</div>

				<div class="descText">
					We will scan your data to identify any inaccuracies <br />
					and correct them automatically.<br />
					Ready for your accurate report?
				</div>
				<div class="buttonWrapper">
					<Button
						color="primary"
						fontcolor="white"
						:rounded="true"
						:height="52"
						:min-width="200"
						:disabled="!autoFixAvailable"
						@click="onClickAutoFix"
					>
						{{ fixButton }}
					</Button>
				</div>

				<div class="skipButton">
					<nuxt-link v-show="autoFixAvailable === false" to="/tax/report">
						Skip review<v-icon color="primary">mdi-chevron-right</v-icon>
					</nuxt-link>
				</div>

				<img src="/characters/smile-5.png" />
			</div>

			<div class="manualReviewCard">
				<div class="titleText">Manual Review</div>
				<div>
					<Button color="primary" fontcolor="white" :width="200" :rounded="true" :height="52" @click="onClickManualFix">
						{{ $t('common.fix') }}
					</Button>
				</div>
			</div>

			<div class="linkWrapper">
				<LinkText to="#"> What’s auto fix? </LinkText>
			</div>
		</div>
		<AutoFixDialog
			:progress="autoFixProgress"
			:done="autoFixingDone"
			:dialog="autoFixDialog"
			@close="closeAutoFixDialog"
			@cancel="cancelAutoFixing"
		/>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import InfoWithCharacterCard from '~/components/card/InfoWithCharacterCard.vue';
import Button from '~/components/button/Button.vue';
import { EAuthRole } from '~/types/common/types';
import LinkText from '~/components/text/LinkText.vue';
import AutoFixDialog from '~/components/dialog/AutoFixDialog.vue';
import { AUTO_FIX, AUTO_FIX_AVAILABLE, AUTO_FIX_PROGRESS, CALL_INITIAL_AUTO_FIXING } from '~/store/review';
import { ICognitoUserExt } from '~/types/auth/types';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { EJobStatus } from '~/types/provider/types';
import { IJobCondition } from '~/types/common/dto';

@Component({
	layout: 'product',
	components: {
		InfoWithCharacterCard,
		Button,
		LinkText,
		AutoFixDialog,
	},
	meta: { auth: true, roles: [EAuthRole.INDIVIDUAL] },
	middleware: 'loadSources',
	asyncData: async ({ store }) => {
		await Promise.all([store.dispatch(`review/${CALL_INITIAL_AUTO_FIXING}`)]);
	},
})
export default class ReviewPage extends Vue {
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;
	autoFixDialog: boolean = false;
	autoFixProgress: number = 0;
	autoFixingDone: boolean = false;
	temp: any = null;
	progressInterval: any = null;
	autoFixAvailable: boolean | null = null;

	get fixButton(): string {
		if (this.autoFixAvailable === true) {
			return this.autoFixingDone ? 'Done!' : String(this.$t('common.fix'));
		} else if (this.autoFixAvailable === false) {
			return String(this.$t('common.fix'));
		} else {
			return '';
		}
	}

	get username(): string {
		return this.user?.username || '';
	}

	cancelAutoFixing() {
		clearInterval(this.temp);
		this.autoFixingDone = false;
		this.autoFixDialog = false;
		this.autoFixProgress = 0;
	}

	completeAutoFixing() {
		clearInterval(this.temp);
		this.autoFixingDone = true;
	}

	async onClickAutoFix() {
		if (!this.autoFixingDone) {
			if (!this.username) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Username not found. Please try again', color: 'warning' });
				return;
			}

			const success: boolean = await this.$store.dispatch(`review/${AUTO_FIX}`, this.username);
			if (!success) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Failed. Pleae try again', color: 'error' });
				return;
			}

			this.progressInterval = setInterval(() => {
				this.progress();
			}, 1500);
		}

		this.autoFixDialog = true;
	}

	async progress() {
		if (this.autoFixingDone) return;

		const res: IJobCondition | null | false = await this.$store.dispatch(`review/${AUTO_FIX_PROGRESS}`, this.username);
		if (res === null) {
			// Job was not found
		} else if (res === false) {
			// Failed
		} else {
			this.autoFixProgress = res.progress;
			if (res.status === EJobStatus.SUCCEEDED) {
				this.autoFixingDone = true;
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Auto fixing successed', color: 'successDark' });
				clearInterval(this.progressInterval);
			} else if (res.status === EJobStatus.FAILED) {
				this.autoFixingDone = true;
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { msg: 'Auto fixing failed', color: 'error' });
				clearInterval(this.progressInterval);
			}
		}
	}

	closeAutoFixDialog() {
		this.autoFixDialog = false;
	}

	onClickManualFix() {
		this.$router.push('/tax/review/manual');
	}

	fetchOnServer() {
		return false;
	}

	async fetch() {
		if (this.username) {
			const res: boolean | null = await this.$store.dispatch(`review/${AUTO_FIX_AVAILABLE}`, this.username);
			this.autoFixAvailable = Boolean(res);
		}
	}

	destroyed() {
		clearInterval(this.progressInterval);
	}
}
</script>

<style lang="scss" scoped>
.reviewTitle {
	margin-top: 72px;
	margin-bottom: 48px;
	display: flex;
	justify-content: center;
	font-size: 46px;
	line-height: 1;
	color: $primary;
}

.autoReviewCard {
	padding-top: 90px;
	padding-bottom: 56px;
	border-radius: $round-lg;
	background-color: $white;
	border: 2px solid $primary;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	margin-bottom: 18px;

	.titleText {
		position: relative;
		z-index: 2;
		font-family: $poppins;
		font-weight: $font-semibold;
		font-size: 33px;
		line-height: 1.2;
		margin-bottom: 16px;
	}

	.descText {
		position: relative;
		z-index: 2;
		font-family: $poppins;
		color: $disabled;
		letter-spacing: 0.15px;
		line-height: 1.7;
		text-align: center;
		margin-bottom: 24px;

		> span {
			color: $secondary;
		}
	}

	.buttonWrapper {
		position: relative;
		z-index: 2;
		margin-bottom: 18px;
	}

	.skipButton {
		text-align: center;
		font-family: $poppins;
		font-weight: $font-semibold;

		a {
			color: $primary;
		}
	}

	img {
		position: absolute;
		z-index: 1;
		bottom: 0px;
		right: 0px;
	}
}

.manualReviewCard {
	padding: 24px 38px;
	background-color: $white;
	border: 1px solid $outline;
	border-radius: $round-lg;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-items: center;
	margin-bottom: 18px;

	> div {
		&.titleText {
			font-family: $poppins;
			font-size: 23px;
			font-weight: $font-semibold;
			color: $primary;
		}

		&:last-child {
			display: flex;
			gap: 12px;
			align-items: center;
			font-size: 14px;
			color: $disabled;
			font-family: $poppins;
			letter-spacing: 0.15px;
			justify-content: flex-end;
		}
	}
}

.linkWrapper {
	padding-left: 16px;
}
</style>
