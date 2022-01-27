<template>
	<div class="queueWrapper">
		<div
			v-for="(message, idx) in messageQueue"
			:key="message.id"
			class="queueInner -shadow"
			:class="addtionalClasses(message, idx)"
		>
			<div>{{ message.msg }}</div>
			<v-icon v-if="!message.actionText" color="white" icon @click="onClickClose(message)">mdi-close-circle</v-icon>
			<span
				v-else
				class="actionText"
				@click="
					() => {
						message.action();
						onClickClose(message);
					}
				"
				>{{ message.actionText }}</span
			>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, State } from 'nuxt-property-decorator';
import { ADD_TO_CLOSING_QUEUE } from '~/store';
import { IMessageItem } from '~/types/common/types';

@Component
export default class MessageQueue extends Vue {
	@State(state => state.uploadingFile) uploadingFile!: boolean;
	@State(state => state.closingMessageIds) closingMessageIds!: string[];
	@State(state => state.messageQueue) messageQueue!: IMessageItem[];

	viewableLength: number = 2;

	addtionalClasses(message: IMessageItem, idx: number): string {
		const closeCondition1 = this.closingMessageIds.includes(message.id);
		const closeCondition2 = Boolean(
			this.messageQueue.length > this.viewableLength && idx < this.messageQueue.length - this.viewableLength,
		);
		let result = '';
		result += closeCondition1 || closeCondition2 ? ' -close ' : '';
		result += message.color ? ` bg-${message.color} ` : ' bg-primary ';
		return result;
	}

	onClickClose(messageItem: IMessageItem) {
		clearTimeout(messageItem.closer);
		this.$store.dispatch(ADD_TO_CLOSING_QUEUE, messageItem.id);
	}
}
</script>

<style lang="scss" scoped>
.queueWrapper {
	position: fixed;
	z-index: 9999;
	display: flex;
	flex-direction: column-reverse;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	transition: all 1s ease-in-out;

	.queueInner {
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 18px;
		border-radius: $round-md;
		min-width: 300px;
		height: 56px;
		margin-bottom: 14px;
		font-size: 14px;
		font-family: $poppins;
		color: white;
		transition: all 0.3s ease-in-out;
		opacity: 1;

		&.-close {
			height: 0;
			margin-bottom: 0;
			opacity: 0;
		}

		.actionText {
			color: $secondary;
			padding: 1px;
			cursor: pointer;
			font-weight: $font-semibold;
			&:hover {
				font-weight: $font-bold;
			}
		}
	}
}
</style>
