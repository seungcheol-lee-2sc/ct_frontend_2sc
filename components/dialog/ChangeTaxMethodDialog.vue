<template>
	<v-dialog v-model="dialog" persistent max-width="528" @keydown.esc="close" @click:outside="close">
		<v-card class="dialogCardWrapper changeStrategyWrapper">
			<h3 class="titleText">Change Tax Strategy</h3>
			<div class="desc">
				You selected <b>{{ currentMethod }}</b> as your accounting method or cost basis method. The IRS expects you to
				use the same method consistently in future years, so you should not change it every year. If you need to change
				your cost basis method, please consult with your tax professional.

				<br />
				<br />
				When you confirm this change, the following information will be updated:

				<ol>
					<li>Net capital gain</li>
					<li>Estimated tax savings</li>
				</ol>
			</div>
			<v-select
				v-model="selectedStrategy"
				:disabled="changing"
				outlined
				hide-details
				:items="taxStrategyObjects"
			></v-select>
			<div class="buttonsWrapper -right">
				<Button color="secondary" :fontsize="14" :text="true" :disabled="changing" @click="close"> Cancel </Button>
				<Button
					color="primary"
					:width="122"
					:height="44"
					:fontsize="14"
					:rounded="true"
					fontcolor="white"
					:disabled="changing"
					:loading="changing"
					@click="changeTaxStrategy"
				>
					{{ $t('common.change') }}
				</Button>
			</div>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { Component, State, Prop, Action, Vue } from 'nuxt-property-decorator';
import Button from '~/components/button/Button.vue';
import { ADD_TO_MESSAGE_QUEUE, CONFIRM_ERROR } from '~/store';
import { UPDATE_METHOD } from '~/store/tax';
import { ETaxStrategy } from '~/types/tax/types';

@Component({
	components: { Button },
})
export default class ChangeTaxMethodDialog extends Vue {
	@Prop() dialog!: boolean;

	@State(({ tax }) => tax.currentMethod) currentMethod!: string;

	selectedStrategy = '';
	ETaxStrategy = ETaxStrategy;
	changing = false;

	get taxStrategyObjects(): any {
		// @ts-ignore
		const taxStrategies = Object.keys(ETaxStrategy).map(v => ETaxStrategy[v]);
		return taxStrategies.map((v: ETaxStrategy) => {
			if (v === ETaxStrategy.FIFO) {
				return { value: v, text: 'FIFO - First in First out' };
			} else if (v === ETaxStrategy.HIFO) {
				return { value: v, text: 'HIFO - High in First out' };
			} else {
				return { value: v, text: 'LIFO - Last in First out' };
			}
		});
	}

	@Action(`tax/${UPDATE_METHOD}`) updateTaxMethod!: any;

	close() {
		!this.changing && this.$emit('close');
		this.selectedStrategy = '';
	}

	async changeTaxStrategy() {
		if (!this.selectedStrategy) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: 'Select tax strategy',
			});
			return;
		}
		if (this.selectedStrategy === this.currentMethod) {
			this.$store.commit(CONFIRM_ERROR, {
				title: this.$t('common.error'),
				text: 'You choosed your current strategy',
			});
			return;
		}

		this.changing = true;
		const res = await this.$store.dispatch(`tax/${UPDATE_METHOD}`, this.selectedStrategy);
		res && this.$store.dispatch(ADD_TO_MESSAGE_QUEUE, { color: 'successDark', msg: this.$t('message.success.update') });
		this.changing = false;
		this.$emit('close');
		this.selectedStrategy = '';
	}

	created() {
		this.selectedStrategy = this.currentMethod;
	}
}
</script>

<style lang="scss" scoped>
.changeStrategyWrapper {
	font-family: $poppins;
	.titleText {
		font-size: 23px;
		padding-top: 10px;
		padding-bottom: 13px;
	}
	.desc {
		font-size: 13px;
		line-height: 20px;
		color: $primaryLight;
		margin-bottom: 20px;
	}
	.buttonsWrapper {
		margin-top: 46px;
	}
}
</style>
