<template>
	<div class="topBodyWrapper">
		<TopSection
			title="Contact Us"
			desc="
                Get in touch with cointelli  support team <br class='brPc'>
                If you have any questions or requests, Please fill out the form below <br class='brPc'>
                We would be glad to help with.
                "
			:is-primary-color="false"
			desc-color="text-primaryLight"
			title-color="text-primary"
		/>
		<div class="sectionWrapper" style="margin-top: 48px; margin-bottom: 120px">
			<div class="formWrap">
				<div class="outLineCard">
					<img
						alt="A smiling circle character."
						src="/characters/leftSmileCirlcle.png"
						class="smileCircleCharacter hide-mb"
					/>
					<div class="formdTitle"><p>Contact Us Form</p></div>
					<v-form id="contact-us-form" ref="form" v-model="formValid" @submit.prevent="onSubmitForm">
						<AlertCard v-if="errorMsg && !formValid" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

						<div class="formInner">
							<div>
								<v-select
									v-model="reason"
									hide-details
									outlined
									label="Reason"
									:items="reasonList"
									:rules="requiredRules"
									:disabled="loading"
								/>
							</div>
							<div>
								<v-text-field
									v-model="email"
									:disabled="loggedIn || loading"
									outlined
									label="Email"
									:rules="emailRules"
								/>
								<v-text-field v-model="subject" :disabled="loading" outlined label="Subject" />
								<v-textarea
									v-model="detail"
									:disabled="loading"
									outlined
									auto-grow
									rows="2"
									row-height="50"
									label="Please describe your issue"
									:rules="requiredRules"
								></v-textarea>
								<div>
									<FileUploadCard
										:disabled="loading"
										:accept-types="['csv', 'zip', 'img']"
										:uploaded-files="[]"
										:multiple="true"
										:max-numbers="3"
										:max-size="10 * 1000000"
										@upload="grabFiles"
									>
										<span class="fileUploadText">Screenshots or files</span>
										<span class="hide-mb">(limited to 10MB total)</span>
									</FileUploadCard>
									<UploadedFileList
										v-if="uploadedFiles.length > 0"
										:files="uploadedFiles"
										:max-length="30"
										@delete="deleteFile"
									/>
								</div>
								<div class="btnWrapper">
									<Button
										:loading="loading"
										:disabled="loading"
										color="primary"
										fontcolor="white"
										type="submit"
										:height="52"
										:block="true"
										:rounded="true"
									>
										{{ $t('common.send') }}
									</Button>
								</div>
							</div>
						</div>
					</v-form>
				</div>
			</div>
		</div>
		<CountMeInSection />
	</div>
</template>

<script lang="ts">
import { Vue, Component, State, Getter } from 'nuxt-property-decorator';
import TopSection from '~/components/section/TopSection.vue';
import ProductCard from '~/components/card/ProductCard.vue';
import FileUploadCard from '~/components/card/FileUploadCard.vue';
import AlertCard from '~/components/card/AlertCard.vue';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { metaInfo } from '~/utils/application';
import { emailRule, requiredRule } from '~/utils/rules';
import { fileListToArr } from '~/utils/func';
import Button from '~/components/button/Button.vue';
import CountMeInSection from '~/components/section/CountMeInSection.vue';
import { ICognitoUserExt } from '~/types/auth/types';
import OutlinedCard from '~/components/card/OutlinedCard.vue';
import { IContactFormDTO } from '~/types/etc/dto';
import { CREATE_CONTACT_US, UPLOAD_TO_S3, UPLOAD_TO_S3_PUBLIC } from '~/store/etc';
import { EXECUTE_RECAPTCHA, INIT_RECAPTCHA } from '~/store/auth';
import UploadedFileList from '~/components/list/UploadedFileList.vue';

@Component({
	components: {
		ProductCard,
		TopSection,
		UploadedFileList,
		FileUploadCard,
		AlertCard,
		Button,
		CountMeInSection,
		OutlinedCard,
	},
})
export default class ContactUs extends Vue {
	head() {
		return metaInfo(
			this.$route.path,
			this.$store.state.content.seo?.custom || [],
			this.$store.state.content.seo?.default,
			'Contact us',
		);
	}

	$refs!: {
		form: HTMLFormElement;
	};

	@State(state => state.isMobile) isMobile!: boolean;
	@State(({ auth }) => auth.user) user!: ICognitoUserExt;
	formValid: boolean = false;
	errorMsg: string = '';
	entered: boolean = false;
	emailRules = [(v: any) => requiredRule(v), (v: any) => emailRule(v, this.$nuxt)];
	requiredRules = [(v: any) => requiredRule(v)];
	loading: boolean = false;
	uploadedFiles: File[] = [];
	email: string = '';
	subject: string = '';
	reason: string = '';
	detail: string = '';
	uploadedFileUrls: string[] = [];

	reasonList: string[] = ['Account settings', 'Delete account', 'Product', 'Pricing', 'Taxes', 'General'];

	@Getter('auth/loggedIn') loggedIn!: boolean;

	get submitData(): IContactFormDTO {
		let message = `* Contact us *\n`;
		message += `Description\n${this.detail}\n`;
		message += `\nAddtional Info\n`;
		message += `Path : ${this.$route.path}\n`;
		if (this.user) {
			message += `User id : ${this.user.getUsername()}\n`;
			message += `User email : ${this.user.attributes?.email || ''}\n`;
		}

		return {
			email: this.email,
			firstname: this.user?.attributes?.given_name || '',
			lastname: this.user?.attributes?.family_name || '',
			category: this.reason,
			subject: this.subject,
			attachments: this.uploadedFileUrls.map((v, idx) => `${idx + 1}. ${v}`).join('\n'),
			message,
		};
	}

	grabFiles(files: FileList) {
		const fileArr = fileListToArr(files);
		this.uploadedFiles.push(...fileArr);
	}

	deleteFile(idx: number) {
		this.uploadedFiles.splice(idx, 1);
	}

	init() {
		this.subject = '';
		this.reason = '';
		this.detail = '';
		this.uploadedFiles = [];
		this.uploadedFileUrls = [];
		if (!this.loggedIn) {
			this.email = '';
		}
		this.$refs.form.reset();
	}

	async onSubmitForm() {
		if (!this.formValid) {
			this.errorMsg = String(this.$t('message.submitAlert'));
			return;
		}

		this.loading = true;

		// upload files to s3
		if (this.uploadedFiles.length > 0) {
			this.uploadedFileUrls = this.loggedIn
				? await this.$store.dispatch(`etc/${UPLOAD_TO_S3}`, this.uploadedFiles)
				: await this.$store.dispatch(`etc/${UPLOAD_TO_S3_PUBLIC}`, { data: this.uploadedFiles, email: this.email });
			if (this.uploadedFileUrls.length === 0) {
				// fail
				this.uploadedFiles = [];
				this.loading = false;
				return;
			}
		}

		this.errorMsg = '';

		const recaptcha: boolean = await this.$store.dispatch(`auth/${EXECUTE_RECAPTCHA}`);
		if (!recaptcha) {
			this.loading = false;
			return;
		}

		const success = await this.$store.dispatch(`etc/${CREATE_CONTACT_US}`, this.submitData);

		if (success) {
			this.init();
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: 'Success to submit' });
		} else {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: 'Fail to submit. Please try again' });
		}
		this.loading = false;
	}

	async mounted() {
		await this.$store.dispatch(`auth/${INIT_RECAPTCHA}`);
		if (this.loggedIn && this.user.attributes?.email) {
			this.email = this.user.attributes.email;
		}
	}
}
</script>

<style lang="scss" scoped>
.illustWrapper {
	width: 100%;
	@media (min-width: #{$breakpoint-xl}) {
		width: fit-content;
		text-align: center;
	}
}
.formWrap {
	// padding: 40px 0;
	@media (min-width: #{$breakpoint-xl}) {
		// background-color: $offWhite;
		// padding: 72px 76px;
		// border: 1px solid $primary;
		// border-radius: $round-lg;
	}
	.outLineCard {
		position: relative;
		overflow: hidden;
		text-align: left;
		border-width: 1px;
		border-style: solid;
		border-radius: $round-lg;
		padding: 45px 21px;
		@media (min-width: #{$breakpoint-xl}) {
			padding: 60px 70px;
		}
	}
	.smileCircleCharacter {
		position: absolute;
		left: 0px;
		bottom: 0px;
	}
	.formdTitle {
		font-family: $primary;
		font-size: 19px;
		font-weight: $font-semibold;
		letter-spacing: 0.15px;
		line-height: 1.58;
		margin-bottom: 34px;
		font-family: $poppins;
		@media (max-width: #{$breakpoint-xl}) {
			display: none;
		}
	}

	.formInner {
		@media (min-width: #{$breakpoint-xl}) {
			display: grid;
			gap: 24px;
			grid-template-columns: repeat(10, minmax(0, 1fr));
		}

		> div {
			&:first-child {
				margin-bottom: 40px;
				@media (min-width: #{$breakpoint-xl}) {
					grid-column: span 4 / span 4;
				}
			}
			&:nth-child(2) {
				@media (min-width: #{$breakpoint-xl}) {
					grid-column: span 6 / span 6;
				}
			}
		}
		.fileUploadText {
			@media (max-width: 320px) {
				font-size: 15px;
			}
		}

		.btnWrapper {
			padding-top: 20px;
			display: flex;
			justify-content: center;
			@media (min-width: #{$breakpoint-xl}) {
				justify-content: flex-end;
			}
		}
	}
}
</style>
