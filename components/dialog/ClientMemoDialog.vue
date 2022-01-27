<template>
	<v-dialog v-model="dialog" max-width="600" @keydown.esc="close" @click:outside="close">
		<v-card class="clientMemoDialogCard">
			<div class="nameTitle">
				<ClientAvatar :client="client" :size="48" :index="index" />
				<span class="clientName">
					{{ `${client.relatedUser.firstName || 'no'} ${client.relatedUser.lastName || 'name'}` }}
				</span>
			</div>
			<v-textarea
				v-model="memoInput"
				hide-details
				outlined
				height="84"
				label="Memo anything about this client"
				maxlength="500"
				class="memoInput"
			></v-textarea>
			<div class="buttonsWrapper -right">
				<Button color="primary" :text="true" :disabled="loading" :fontsize="14" @click="close">Cancel</Button>
				<Button
					color="primary"
					fontcolor="white"
					:disabled="loading"
					:depressed="true"
					:fontsize="14"
					@click="onclickSaveMemo"
					>Save</Button
				>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import ClientAvatar from '../avatar/ClientAvatar.vue';
import Button from '../button/Button.vue';
import { IRelatedObject } from '~/types/accountant/types';
import { UPDATE_RELATED_OBJECT } from '~/store/accountant';
import { ADD_TO_MESSAGE_QUEUE } from '~/store';

@Component({
	components: { ClientAvatar, Button },
})
export default class ClientMemoDialog extends Vue {
	@Prop({ required: true }) dialog!: boolean;
	@Prop({ required: true }) client!: IRelatedObject;
	@Prop({ required: true }) index!: number;
	@Prop({ required: true }) initMemo!: string | null;

	memoInput = '';
	loading: boolean = false;

	async updateMemo(relatedObject: IRelatedObject): Promise<boolean> {
		const updatedMemo = { ...relatedObject, memo: this.memoInput };
		return await this.$store.dispatch(`accountant/${UPDATE_RELATED_OBJECT}`, updatedMemo);
	}

	async onclickSaveMemo() {
		this.loading = true;
		const result = await this.updateMemo(this.client);
		if (!result) {
			this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'error', msg: `${this.$i18n.t('message.fail.update')}` });
			this.loading = false;
			return;
		}
		this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
		this.loading = false;
		this.$emit('retrieve');
		this.$emit('close');
	}

	close() {
		this.$emit('close');
	}

	created() {
		if (this.initMemo) {
			this.memoInput = this.initMemo;
		}
	}
}
</script>

<style lang="scss" scoped>
.clientMemoDialogCard {
	padding: 34px 28px;
	.nameTitle {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 28px;
		.clientName {
			font-family: $poppins;
			font-size: 23px;
			letter-spacing: 0px;
		}
	}
	.memoInput {
		margin-bottom: 28px;
	}
}
</style>
