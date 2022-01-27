<template>
	<div>
		<div class="sheetWrapper">
			<Button :rounded="true" fontcolor="white" color="primary" :height="52" @click="onClick">
				{{ $t('page.import.loginImportButton', { target: selectedProvider.name }) }}
			</Button>
		</div>
		<ImportNotice icon="mdi-shield-half-full">
			We have read-only access to your account. We are not authorized to access your private keys or to move your funds.
		</ImportNotice>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import ImportNotice from '../text/ImportNotice.vue';
import { LOAD_PROVIDER_SOURCES } from '~/store/provider';
import { LOGIN_IMPORT } from '~/store/import';
import { ITransactionRecordProvider, IUserTransactionRecordSource } from '~/types/provider/types';
import { reserveLoginImport, getIconImage } from '~/utils/application';
import Button from '~/components/button/Button.vue';
import { ILoginImportDTO } from '~/types/import/dto';

@Component({
	components: {
		Button,
		ImportNotice,
	},
})
export default class ImportByLoginSheet extends Vue {
	@Prop({ required: true }) selectedProvider!: ITransactionRecordProvider;

	get iconImage(): string {
		return getIconImage(this.selectedProvider?.iconImage || '', 32) || '';
	}

	async onClick() {
		if (!this.selectedProvider?.id) return;

		const DTO: ILoginImportDTO = {
			providerId: this.selectedProvider?.id,
			sourceId: undefined,
		};

		const res: string | IUserTransactionRecordSource = await this.$store.dispatch(`import/${LOGIN_IMPORT}`, DTO);
		if (typeof res === 'string' && res.includes('http')) {
			reserveLoginImport(this.$cookies, this.selectedProvider.id);
			location.href = res;
		} else {
			this.$store.dispatch(`provider/${LOAD_PROVIDER_SOURCES}`);
		}
		this.$emit('callback');
	}
}
</script>

<style lang="scss" scoped>
.sheetWrapper {
	border: 1px solid $outline;
	display: flex;
	justify-content: center;
	padding: 80px 0;
	border-radius: $round-sm;
	margin-bottom: 20px;
}
</style>
