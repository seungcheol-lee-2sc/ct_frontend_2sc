<template>
	<v-form ref="form" @submit.prevent="onSubmitForm">
		<AlertCard v-if="errorMsg" :msg="errorMsg" color="error" icon="mdi-alert-circle-outline" />

		<div class="formContentWrapper">
			<div class="contentWrapper">
				<div class="avatarWrapper">
					<UserAvatar :size="56" background="primaryLight" />
					<div v-if="avatarImageUrl" class="removePhoto" :class="isLoading ? '-loading' : ''" @click="removePhoto">
						{{ $t('common.remove') }}
					</div>
				</div>
				<div class="uploadCard">
					<FileUploadCard
						:no-margin="true"
						:disabled="isLoading"
						:accept-types="['img']"
						:uploaded-files="uploadedFile ? [uploadedFile] : []"
						:init-trigger="initTrigger"
						@upload="grabFile"
						@delete="deleteFile"
					>
						{{ $t('common.dropFile') }}
					</FileUploadCard>
				</div>
			</div>
		</div>
		<div class="formBtnWrapper -dense -wide">
			<Button
				:rounded="true"
				:disabled="isLoading"
				:loading="isLoading"
				:block="isMobile"
				fontcolor="white"
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
import { Component, Getter, State, Vue } from 'nuxt-property-decorator';
import Button from '../button/Button.vue';
import UserAvatar from '~/components/avatar/UserAvatar.vue';
import AlertCard from '~/components/card/AlertCard.vue';
import FileUploadCard from '~/components/card/FileUploadCard.vue';
import { PROFILE_IMAGE, UPDATE_ATTRIBUTES } from '~/store/auth';

@Component({
	components: {
		UserAvatar,
		AlertCard,
		FileUploadCard,
		Button,
	},
})
export default class ProfilePhotoForm extends Vue {
	$refs!: {
		form: HTMLFormElement;
		imageUploader: HTMLInputElement;
	};

	@State(state => state.isMobile) isMobile!: boolean;
	errorMsg: string = '';
	entered: boolean = false;
	uploadedFile: File | null = null;
	isLoading: boolean = false;
	initTrigger: boolean = false;

	@Getter('auth/avatarImageUrl') avatarImageUrl!: string;

	async removePhoto() {
		if (this.isLoading) return;
		this.errorMsg = '';
		this.isLoading = true;
		await this.$store.dispatch(`auth/${UPDATE_ATTRIBUTES}`, { picture: null });
		this.isLoading = false;
	}

	async onSubmitForm() {
		if (!this.uploadedFile) {
			this.errorMsg = String(this.$t('message.submitAlert'));
			this.$refs.form.validate();
			return;
		}
		this.errorMsg = '';
		this.isLoading = true;
		const formData = new FormData();
		formData.append('profileImage', this.uploadedFile, this.uploadedFile.name);
		await this.$store.dispatch(`auth/${PROFILE_IMAGE}`, formData);
		this.uploadedFile = null;
		this.isLoading = false;
		this.initTrigger = !this.initTrigger;
	}

	deleteFile() {
		this.uploadedFile = null;
	}

	grabFile(files: FileList) {
		// @ts-ignore
		this.uploadedFile = files[0];
	}
}
</script>

<style lang="scss" scoped>
.contentWrapper {
	@media (min-width: #{$breakpoint-xl}) {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 20px;
	}

	.avatarWrapper {
		margin-bottom: 8px;
		text-align: center;
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 2 / span 2;
			margin-bottom: 0px;
		}

		.removePhoto {
			font-size: 12px;
			margin-top: 4px;
			color: $error;
			cursor: pointer;
			&:hover {
				text-decoration: underline;
			}

			&.-loading {
				color: $disabled;
				cursor: default;
			}
		}
	}

	.uploadCard {
		@media (min-width: #{$breakpoint-xl}) {
			grid-column: span 10 / span 10;
		}
	}
}
</style>
