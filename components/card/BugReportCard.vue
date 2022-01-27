<template>
	<v-card class="navCard" color="offWhite" outlined elevation="0">
		<span v-if="!canNotClose" style="position: absolute; top: 0; right: 0">
			<v-btn icon small color="primaryLight" @click="onClickCancel">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</span>
		<v-form id="bug-report-form" ref="form" v-model="formValid" @submit.prevent="onSubmitBugReport">
			<template v-if="!hideHeader">
				<div class="titleText">
					<v-icon color="secondary">mdi-message-reply-text-outline</v-icon>
					{{ $t('product.bugReport.title') }}
				</div>
			</template>

			<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

			<div class="inputsWrapper">
				<v-select
					v-model="category"
					:disabled="loading || fixedCategory"
					background-color="white"
					outlined
					filled
					:label="$t('product.bugReport.placeholder1')"
					hide-details
					:rules="requiredRules"
					item-value="value"
					item-text="text"
					:items="selectItems"
				/>

				<v-text-field
					v-model="title"
					:disabled="loading"
					background-color="white"
					outlined
					filled
					:label="$t('product.bugReport.label2')"
					:placeholder="$t('product.bugReport.placeholder2')"
					:rules="requiredRules"
					hide-details
					class="sm-placeholder"
				/>

				<v-textarea
					v-model="detail"
					:disabled="loading"
					background-color="white"
					outlined
					filled
					:label="$t('product.bugReport.label3')"
					:placeholder="$t('product.bugReport.placeholder3')"
					:rules="requiredRules"
					class="textLeft sm-placeholder"
					hide-details
				></v-textarea>

				<div>
					<FileUploadCard
						:disabled="loading"
						:uploaded-files="[]"
						:accept-types="['csv', 'zip', 'img']"
						:multiple="true"
						:max-numbers="3"
						:no-margin="true"
						@upload="grabFiles"
					>
						{{ $t('common.dropFile') }}
					</FileUploadCard>
					<UploadedFileList
						v-if="uploadedFiles.length > 0"
						:files="uploadedFiles"
						:max-length="30"
						@delete="onDeleteUploadedFile"
					/>
				</div>
			</div>

			<div class="contentText" v-html="$t('product.bugReport.desc')"></div>

			<div class="buttonsWrapper -right">
				<Button
					v-if="!canNotClose"
					:fontsize="14"
					:disabled="loading"
					color="secondary"
					:text="true"
					@click="onClickCancel"
				>
					{{ $t('common.cancel') }}
				</Button>
				<Button
					:fontsize="14"
					:rounded="true"
					:disabled="loading"
					fontcolor="white"
					:loading="loading"
					color="primary"
					type="submit"
				>
					{{ $t('common.send') }}
				</Button>
			</div>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import { Component, Prop, Getter, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import UploadedFileList from '../list/UploadedFileList.vue';
import FileUploadCard from '~/components/card/FileUploadCard.vue';
import { CONFIRM_ACTION, ADD_TO_MESSAGE_QUEUE } from '~/store';
import { ICognitoUserExt } from '~/types/auth/types';
import { CREATE_BUG_REPORT, UPLOAD_TO_S3 } from '~/store/etc';
import { EMAIL_ID_BUG_REPORT_RECIEVED } from '~/utils/constants';
import { fileListToArr } from '~/utils/func';
import { requiredRule } from '~/utils/rules';
import AlertCard from '~/components/card/AlertCard.vue';
import { IContactFormDTO } from '~/types/etc/dto';
import { EmailService } from '~/services/EmailService';

@Component({
	components: {
		AlertCard,
		UploadedFileList,
		FileUploadCard,
		Button,
	},
})
export default class BugReportCard extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};

	@Prop() hideHeader!: boolean;
	@Prop() canNotClose!: boolean;
	@Prop() fixedCategory!: string | any;

	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	uploadedFiles: File[] = [];
	reason: string = '';
	category: string | null = null;
	title: string = '';
	detail: string = '';
	uploadedFileUrls: string[] = [];
	loading: boolean = false;
	formValid: boolean = false;
	errorMsg: string = '';
	requiredRules = [(v: string) => requiredRule(v)];
	selectItems: any[] = [
		{ value: 'Import', text: 'Import' },
		{ value: 'View transactions', text: 'View transactions' },
		{ value: 'Statistical data', text: 'Statistical data' },
		{ value: 'Review transactions', text: 'Review transactions' },
		{ value: 'Report', text: 'Report' },
		{ value: 'Account', text: 'Account' },
		{ value: 'Pricing', text: 'Pricing' },
		{ value: 'Others', text: 'Others' },
	];

	@Getter('auth/userEmail') userEmail!: string;

	get submitData(): IContactFormDTO {
		let message = `* Bug report *\n`;
		message += `Description\n${this.detail}\n`;
		message += `\nAddtional Info\n`;
		message += `Path : ${this.$route.path}\n`;
		if (this.user) {
			message += `User id : ${this.user.getUsername()}\n`;
			message += `User email : ${this.user.attributes?.email || ''}\n`;
		}

		return {
			email: this.user?.attributes?.email || '',
			firstname: this.user?.attributes?.given_name || '',
			lastname: this.user?.attributes?.family_name || '',
			technical_category: this.category || '',
			subject: this.title,
			attachments: this.uploadedFileUrls.map((v, idx) => `${idx + 1}. ${v}`).join('\n'),
			message,
		};
	}

	onDeleteUploadedFile(idx: number) {
		this.uploadedFiles.splice(idx, 1);
	}

	grabFiles(files: FileList) {
		const fileArr = fileListToArr(files);
		this.uploadedFiles.push(...fileArr);
	}

	deleteFile(name: string) {
		const idx = this.uploadedFiles.findIndex(v => v.name === name);
		this.uploadedFiles.splice(idx, 1);
	}

	onClickCancel() {
		if (!this.detail && !this.detail.trim() && this.uploadedFiles.length === 0) {
			this.uploadedFiles = [];
			this.detail = '';
			this.$emit('cancel');
		} else {
			this.$store.commit(CONFIRM_ACTION, {
				title: this.$t('common.cancel'),
				text: this.$t('message.cancelConfirmation'),
				pending: () => {
					this.uploadedFiles = [];
					this.detail = '';
					this.$emit('cancel');
				},
			});
		}
	}

	init() {
		this.title = '';
		this.uploadedFiles = [];
		this.reason = '';
		this.detail = '';
		this.uploadedFileUrls = [];
		if (!this.fixedCategory) {
			this.category = '';
		}
	}

	async sendEmailBugReportRecieved() {
		// return;
		await new EmailService(this.$store, EMAIL_ID_BUG_REPORT_RECIEVED, this.userEmail).sendEmail();
	}

	async onSubmitBugReport() {
		if (!this.formValid || !this.detail || !this.detail.trim() || !this.title || !this.title.trim() || !this.category) {
			this.detail = this.detail.trim();
			this.title = this.title.trim();
			this.errorMsg = String(this.$t('message.bugReportMessage'));
			this.$refs.form.validate();
			return;
		}

		this.errorMsg = '';
		this.loading = true;

		// upload files to s3
		if (this.uploadedFiles.length > 0) {
			this.uploadedFileUrls = await this.$store.dispatch(`etc/${UPLOAD_TO_S3}`, this.uploadedFiles);
			if (this.uploadedFileUrls.length === 0) {
				// fail
				this.uploadedFiles = [];
				this.loading = false;
				return;
			}
		}

		const success = await this.$store.dispatch(`etc/${CREATE_BUG_REPORT}`, this.submitData);

		if (success) {
			this.init();
			this.sendEmailBugReportRecieved();
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.submit') });
			!this.canNotClose && this.$emit('cancel');
			this.$refs.form.reset();
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
				color: 'error',
				msg: `${this.$t('message.success.submit')}. ${this.$t('message.tryAgain')}`,
			});
		}
		this.loading = false;
	}

	created() {
		this.category = this.fixedCategory || '';
	}
}
</script>

<style lang="scss" scoped>
.navCard {
	.titleText {
		font-family: $poppins;
		font-weight: $font-medium;
		font-size: 14px;
		margin-bottom: 40px;
	}
	.contentText {
		color: $primaryLight;
		font-size: 14px;
		font-family: $roboto;
		line-height: 1.5;
	}

	.inputsWrapper {
		margin-bottom: 12px;
		display: flex;
		flex-direction: column;
		gap: 20px;

		textarea {
			text-align: left !important;
		}
	}
	.buttonsWrapper {
		margin-top: 40px;
	}
}
</style>
