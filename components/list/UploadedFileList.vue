<template>
	<div v-if="files && files.length > 0" class="uploadedFilesWrapper">
		<div v-for="(file, idx) in files" :key="`uploaded-${file}-${idx}`" class="uploadedFile">
			<v-icon color="primary" small>mdi-file-document-outline</v-icon>
			{{ omitText(file.name) }}
			<v-icon class="deleteIcon" color="primary" small @click="$emit('delete', idx)">mdi-close</v-icon>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { omitText } from '~/utils/string';

@Component
export default class UploadedFileList extends Vue {
	@Prop({ required: true }) files!: File[];
	@Prop() maxLength!: number;

	omitText(filename: string) {
		return this.maxLength ? omitText(filename, this.maxLength) : filename;
	}
}
</script>

<style lang="scss" scoped>
.uploadedFilesWrapper {
	margin-top: 8px;
	display: flex;
	gap: 2px;
	flex-direction: column;

	.uploadedFile {
		color: $primary;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 4px;
	}
}
</style>
