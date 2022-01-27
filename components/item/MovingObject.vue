<template>
	<div v-show="!hide" ref="movingObject" class="movingObject" :class="addtionalClass" :style="styleObject">
		<img v-if="img" :src="img" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { gsap, Power4 } from 'gsap';

export enum EMovingObjSize {
	XXXXXXL = 218,
	XXXXXL = 156,
	XXXXL = 128,
	XXXL = 96,
	XXL = 76,
	XL = 52,
	L = 48,
	M = 36,
	S = 24,
	XS = 12,
}

export enum EMoveType {
	SHAKE = 'SHAKE',
	ROTATE = 'ROTATE',
	WAVE = 'WAVE',
	BEAT = 'BEAT',
}

@Component
export default class MovingObject extends Vue {
	$refs!: {
		movingObject: HTMLElement;
	};

	@Prop({ required: true }) size!: EMovingObjSize | number;
	@Prop() color!: string | undefined;
	@Prop() left!: string | undefined;
	@Prop() top!: string | undefined;
	@Prop() movement!: EMoveType | undefined;
	@Prop() zIndex!: number | undefined;
	@Prop() opacity!: number | undefined;
	@Prop() noRounded!: boolean;
	@Prop() img!: string;
	@Prop() hide!: boolean;

	xRange = Math.floor(Math.random() * 5) + 5;
	yRange = Math.floor(Math.random() * 200) + 5;
	durationRange = Math.floor(Math.random() * 6) + 4;
	randomColors = ['secondaryLight', 'purpleLight', 'orangeLight', 'tertiary', 'bluePale', 'pinkPale'];

	get addtionalClass(): string {
		let result = this.img ? '' : `bg-${this.finalColor} `;
		result += this.noRounded ? '' : 'round ';
		return result;
	}

	get finalColor(): string {
		const randomIndex = Math.floor(Math.random() * this.randomColors.length);
		return this.color || this.randomColors[randomIndex];
	}

	get styleObject(): any {
		let obj: any = {
			width: `${this.size}px`,
			height: `${this.size}px`,
			zIndex: this.zIndex !== undefined ? this.zIndex : 0,
			opacity: this.opacity !== undefined ? this.opacity : 1,
		};

		if (this.left && this.top) {
			obj = {
				...obj,
				left: `${this.left}`,
				top: `${this.top}`,
			};
		}

		return obj;
	}

	rotating() {
		gsap.to(this.$refs.movingObject, {
			duration: this.durationRange,
			rotation: 360,
			transformOrigin: `center center`,
			repeat: -1,
			ease: Power4.easeIn,
		});
	}

	beating() {
		gsap.fromTo(
			this.$refs.movingObject,
			{
				duration: this.durationRange,
				scale: 1.2,
				repeat: -1,
				yoyo: true,
				ease: Power4.easeInOut,
			},
			{
				duration: this.durationRange,
				scale: 0.8,
				repeat: -1,
				yoyo: true,
				ease: Power4.easeInOut,
			},
		);
	}

	shaking() {
		gsap.to(this.$refs.movingObject, { duration: 5, x: '+=20', yoyo: true, repeat: -1 });
	}

	waving() {
		gsap.fromTo(
			this.$refs.movingObject,
			{
				duration: this.durationRange,
				scale: 1.2,
				repeat: -1,
				x: `-${this.xRange}`,
				Y: `-${this.yRange}`,
				yoyo: true,
				ease: Power4.easeInOut,
			},
			{
				duration: this.durationRange,
				scale: 0.8,
				repeat: -1,
				x: `${this.xRange}`,
				Y: `${this.yRange}`,
				yoyo: true,
				ease: Power4.easeInOut,
			},
		);
	}

	moving() {
		if (!this.movement) return;

		if (this.movement === EMoveType.SHAKE) {
			this.shaking();
		} else if (this.movement === EMoveType.ROTATE) {
			this.rotating();
		} else if (this.movement === EMoveType.BEAT) {
			this.beating();
		} else if (this.movement === EMoveType.WAVE) {
			this.waving();
		}
	}

	beforeDestroy() {
		gsap.killTweensOf(this.$refs.movingObject);
	}

	mounted() {
		gsap.killTweensOf(this.$refs.movingObject);
		this.moving();
	}
}
</script>

<style lang="scss" scoped>
.movingObject {
	position: absolute;

	&.round {
		border-radius: $round-full !important;
	}

	// img {
	// 	width: 100%;
	// }
}
</style>
