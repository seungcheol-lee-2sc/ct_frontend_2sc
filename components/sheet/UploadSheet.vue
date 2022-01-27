<template>
	<div>
		<div
			class="uploadSheet"
			:class="entered ? '-entered' : ''"
			@dragenter.prevent="droppable ? (entered = true) : {}"
			@dragover.prevent="droppable ? (entered = true) : {}"
			@dragleave.prevent="droppable ? (entered = false) : {}"
			@drop.prevent="onDropFileUploader"
			@click="onClickSheet"
		>
			<v-icon size="40">
				<template v-if="entered">mdi-upload</template>
				<template v-else>mdi-file-upload-outline</template>
			</v-icon>
		</div>
		<input
			ref="fileUploader"
			type="file"
			style="display: none"
			:accept="acceptedString"
			multiple
			@change="onChangeFileUploader"
		/>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { CONFIRM_ERROR } from '~/store';
import { fileListToArr } from '~/utils/func';
import { FileService, makeAcceptableExt, makeAcceptableMediaType, TFileType } from '~/services/FileService';

@Component
export default class UploadSheet extends Vue {
	$refs!: {
		fileUploader: HTMLInputElement;
	};

	@Prop({ required: true }) droppable!: boolean;
	@Prop({ required: true }) acceptTypes!: TFileType[];

	acceptedString: string = '';
	entered: boolean = false;

	onClickSheet() {
		this.$refs.fileUploader.click();
	}

	onChangeFileUploader() {
		// @ts-ignore
		const files: FileList = this.$refs.fileUploader.files || [];
		const fileArr: File[] = fileListToArr(files);

		const fileService = new FileService(fileArr, this.acceptTypes);
		const acceptable: true | string = fileService.checkExt();
		if (acceptable !== true) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.acceptableOnly', { ext: acceptable }),
			});

			this.$refs.fileUploader.value = '';
			return;
		}

		this.$emit('upload', files);
		this.$refs.fileUploader.value = '';
	}

	onDropFileUploader(e: any) {
		if (!this.droppable) {
			return;
		}

		const files: FileList = e.dataTransfer.files;
		const fileArr: File[] = fileListToArr(files);

		this.entered = false;
		const fileService = new FileService(fileArr, this.acceptTypes);
		const acceptable: true | string = fileService.checkExt();
		if (acceptable !== true) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: this.$t('message.acceptableOnly', { ext: acceptable }),
			});
			this.$refs.fileUploader.value = '';
			return;
		}
		this.$emit('upload', files);
		this.$refs.fileUploader.value = '';
	}

	created() {
		const extArr = makeAcceptableExt(this.acceptTypes);
		const mediaArr = makeAcceptableMediaType(this.acceptTypes);
		this.acceptedString = [...extArr, ...mediaArr].join(',');
	}
}
</script>

<style lang="scss" scoped>
@mixin transtion {
	transition: all 0.2s ease-in-out;
}

.uploadSheet {
	i {
		@include transtion();
		color: $primaryPale;
	}

	cursor: pointer;
	height: 96px;
	border: 2px dashed $primaryPale;
	border-radius: $round-xs;
	padding: 24px;
	background-color: $offWhite;
	text-align: center;
	margin-top: 24px;
	@include transtion();
	&:hover {
		background-color: $secondaryPale;
		border-color: $secondaryPale;
		i {
			color: $white;
		}
	}

	&.-entered {
		background-color: $secondary;
		border-color: $secondary;
		i {
			color: $white;
		}
	}
}
</style>
