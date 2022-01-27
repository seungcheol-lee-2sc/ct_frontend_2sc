<template>
	<div class="cardWrapper" :class="noMargin ? '-no-margin' : ''">
		<span v-if="label" class="cardLabel">{{ label }}</span>
		<div class="inputWrapper" :class="label ? '-label' : ''">
			<v-card
				class="fileUploadCard"
				:color="bgColor"
				:disabled="disabled"
				outlined
				height="56"
				@dragenter.prevent="entered = true"
				@dragover.prevent="entered = true"
				@dragleave.prevent="entered = false"
				@drop.prevent="onDropFileUploader"
			>
				<div v-if="uploadIcon" class="uploadIcon">
					<v-icon color="white">mdi-file-upload-outline</v-icon>
				</div>
				<div v-if="uploadedFiles.length > 0" class="uploadedFileText">
					<span>
						{{ uploadedFiles.length === 1 ? omitText(uploadedFiles[0].name) : `${uploadedFiles.length} files` }}
					</span>
					<v-icon class="deleteIcon" small @click="onClickDelete">mdi-close</v-icon>
				</div>
				<div v-else class="notUploadedFileText">
					<div class="fileUploadText">
						<slot></slot>
					</div>
					<div class="browseText" @click="onClickFileUploader">
						{{ $t('common.browse') }}
					</div>
				</div>

				<input
					ref="fileUploader"
					class="fileUploaderInput"
					type="file"
					style="display: none"
					:multiple="multiple"
					:accept="acceptedString"
					:disabled="disabledInput"
					@change="onChangeFileUploader"
				/>
			</v-card>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, State, Vue, Watch } from 'nuxt-property-decorator';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';
import { fileListToArr } from '~/utils/func';
import { omitText } from '~/utils/string';
import { FileService, makeAcceptableExt, makeAcceptableMediaType, TFileType } from '~/services/FileService';
import { ICognitoUserExt } from '~/types/auth/types';

@Component
export default class FileUploadCard extends Vue {
	$refs!: {
		fileUploader: HTMLInputElement;
	};

	@Prop() label!: string;
	@Prop() backgroundColor!: string;
	@Prop({ required: true }) acceptTypes!: TFileType[];
	@Prop({ required: true }) uploadedFiles!: File[];
	@Prop() noMargin!: boolean;
	@Prop() multiple!: boolean;
	@Prop() maxNumbers!: number;
	@Prop() maxSize!: number;
	@Prop() uploadIcon!: boolean;
	@Prop() disabled!: boolean;
	@Prop() initTrigger!: boolean;
	@Prop() largeFileAlarm!: boolean;

	entered: boolean = false;
	etcEntered: boolean = false;
	acceptedString: string = '';
	@State(({ auth }) => auth.user) user!: ICognitoUserExt | null;

	@Watch('initTrigger', { immediate: true, deep: true })
	watchIntiTrigger(newVal: boolean, oldVal: boolean) {
		if (typeof newVal === 'boolean' && typeof oldVal === 'boolean') {
			this.initInput();
		}
	}

	get disabledInput(): boolean {
		if (typeof this.maxNumbers === 'number') {
			return this.maxNumbers <= this.uploadedFiles.length;
		}
		return false;
	}

	get bgColor() {
		if (this.entered) {
			return 'secondaryPale';
		} else {
			return this.backgroundColor || 'outlined';
		}
	}

	get enterToSheet() {
		return Boolean(this.entered || this.etcEntered);
	}

	omitText = (str: string) => omitText(str, 36);

	acceptableFiles(fileArr: File[]): boolean {
		const fileService = new FileService(fileArr, this.acceptTypes);

		/**
		 * # of files check
		 */
		if (typeof this.maxNumbers === 'number') {
			const acceptable = fileService.checkCount(this.maxNumbers);
			if (!acceptable) {
				alert(this.$t('message.maxFileNumber', { num: this.maxNumbers }));
				return false;
			}
		}

		/**
		 * Extension check
		 */
		if (this.acceptTypes.length > 0) {
			const acceptable: true | string = fileService.checkExt();
			if (acceptable !== true) {
				this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, {
					color: 'error',
					msg: this.$t('message.acceptableOnly', { ext: acceptable }),
				});
				this.initInput();
				this.entered = false;
				return false;
			}
		}

		/**
		 * Size check
		 */
		const res: true | any =
			this.largeFileAlarm && this.user
				? fileService.checkSizeAndSendToContact(this.maxSize || 0, this.$store, this.user, this.$route)
				: fileService.checkSize(this.maxSize || 0);
		if (res !== true) {
			alert(this.$t('message.maxFileSize', { max: res.max, filename: res.file.name }));
			return false;
		}

		return true;
	}

	initInput() {
		// @ts-ignore
		document.querySelectorAll('.fileUploaderInput').forEach((el: HTMLInputElement) => {
			el.value = '';
		});
	}

	onDropFileUploader(e: any) {
		const files: FileList = e.dataTransfer.files;
		const fileArr: File[] = fileListToArr(files);

		if (!this.multiple && files.length > 1) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: this.$t('message.aFileOnly') });
			this.initInput();
			this.entered = false;
			return;
		}

		const check = this.acceptableFiles(fileArr);
		if (!check) {
			this.entered = false;
			return;
		}

		this.entered = false;

		this.uploading(files);
		this.initInput();
	}

	onChangeFileUploader() {
		// @ts-ignore
		const files: FileList = this.$refs.fileUploader.files;
		const fileArr: File[] = fileListToArr(files);

		const check = this.acceptableFiles(fileArr);
		if (!check) return;

		this.uploading(files);
	}

	uploading(files: FileList) {
		this.$emit('upload', files);
	}

	onClickFileUploader() {
		this.$refs.fileUploader.click();
	}

	onClickDelete() {
		this.initInput();
		this.$emit('delete');
	}

	created() {
		const extArr = makeAcceptableExt(this.acceptTypes);
		const mediaArr = makeAcceptableMediaType(this.acceptTypes);
		this.acceptedString = [...extArr, ...mediaArr].join(',');
	}
}
</script>

<style lang="scss" scoped>
.cardWrapper {
	display: grid;
	grid-template-columns: repeat(10, minmax(0, 1fr));
	gap: 8px;
	align-items: center;
	margin-bottom: 20px;

	&.-no-margin {
		margin-bottom: 0;
	}

	.cardLabel {
		grid-column: span 3 / span 3;
	}

	.inputWrapper {
		grid-column: span 10 / span 10;
		&.-label {
			grid-column: span 7 / span 7;
		}

		.fileUploadCard {
			// display: flex;
			align-items: center;
			padding: 16px 8px;
			gap: 16px;
			border: 1px solid $outline !important;
			.uploadIcon {
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: $secondary;
				height: 40px;
				width: 40px;
				border-radius: 100% !important;
			}

			.uploadedFileText {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 16px;
				letter-spacing: 1px;
				.deleteIcon {
					&:hover {
						color: $errorDark;
					}
				}
			}

			.notUploadedFileText {
				display: flex;

				justify-content: space-between;
				.fileUploadText {
					color: $disabled;
					padding-left: 8px;
				}

				.browseText {
					cursor: pointer;
					color: $secondary;
					font-weight: $font-medium;
					padding-right: 20px;
				}
			}
		}
	}
}
</style>
