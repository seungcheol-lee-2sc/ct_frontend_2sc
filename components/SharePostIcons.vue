<template>
	<v-hover v-slot="{ hover }" open-delay="100">
		<div class="shareIconsWrapper">
			<span>
				<v-img src="/icon/share/share.png" alt="sharing icon" class="shareIconImage" width="fit-content" />
			</span>
			<template v-for="sharePostIcon in sharePostIcons">
				<div v-if="Boolean(sharePostIcon.href) && hover" :key="sharePostIcon.name">
					<v-tooltip bottom>
						<template #activator="{ on, attrs }">
							<a
								v-bind="attrs"
								:href="sharePostIcon.href"
								rel="noopener noreferrer"
								target="_blank"
								class="tooltipLink"
								v-on="on"
							>
								<v-img
									:src="sharePostIcon.src"
									:alt="`${sharePostIcon.name}-icon`"
									class="shareIconImage"
									width="fit-content"
								/>
							</a>
						</template>
						<span>{{ firstCharUppercase(sharePostIcon.name) }}</span>
					</v-tooltip>
				</div>
			</template>
		</div>
	</v-hover>
</template>

<script lang="ts">
import { Vue, Component, Getter } from 'nuxt-property-decorator';
import { ISharePostIcon } from '~/types/content/types';
import { firstCharUppercase } from '~/utils/string';

@Component
export default class SharePostIcons extends Vue {
	@Getter('content/sharePostIcons') sharePostIcons!: ISharePostIcon[];

	firstCharUppercase = (str: string) => firstCharUppercase(str);
}
</script>

<style lang="scss" scoped>
.shareIconsWrapper {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 2px 0;

	.tooltipLink {
		&:hover {
			border: 1px solid $primary;
		}
	}
}
</style>
