<template>
	<div class="topBodyWrapper">
		<div class="bodyWrapper">
			<img class="hide-pc -grayscale" src="/event/mk-mb.png" alt="Mark's Picture" />
			<img class="hide-mb -grayscale" src="/event/mk.png" alt="Mark's Picture" />
			<div class="contentWrapper">
				<img class="content-logo hide-pc" src="/event/logo-mb.png" alt="Logo" />
				<img class="content-logo hide-mb" src="/event/logo.png" alt="Logo" />
				<img class="content-title hide-pc" src="/event/title-mb.png" alt="Title" />
				<img class="content-title hide-mb" src="/event/title.png" alt="Title" />
				<img class="content-text hide-pc" src="/event/content-mb.png" alt="Content" />
				<img class="content-text hide-mb" src="/event/content.png" alt="Content" />
			</div>
			<div class="benefitsWrapper">
				<img class="benefit-title hide-pc" src="/event/benefits-mb.png" alt="Benfits Title" />
				<img class="benefit-title hide-mb" src="/event/benefits.png" alt="Benfits TItle" />
				<img class="benefit-item1 hide-pc" src="/event/benefits1-mb.png" alt="Benfits1" />
				<img class="benefit-item1 hide-mb" src="/event/benefits1.png" alt="Benfits1" />
				<img class="benefit-item2 hide-pc" src="/event/benefits2-mb.png" alt="Benfit2" />
				<img class="benefit-item2 hide-mb" src="/event/benefits2.png" alt="Benfits2" />
				<img class="benefit-item3 hide-pc" src="/event/benefits-explain-mb.png" alt="Explanation of benefits" />
				<img class="benefit-item3 hide-mb" src="/event/benefits-explain.png" alt="Explanation of benefits" />
			</div>
			<div class="eventWrapper">
				<img class="event-logo hide-pc" src="/event/logo-mb.png" alt="Logo" />
				<img class="event-logo hide-mb" src="/event/logo.png" alt="Logo" />
				<nuxt-link to="/user/sign-up">
					<img class="event-button hide-pc" src="/event/event-button-mb.png" alt="Event Button" />
				</nuxt-link>
				<nuxt-link to="/user/sign-up">
					<img class="event-button hide-mb" src="/event/event-button.png" alt="Event Button" />
				</nuxt-link>
				<img class="event-item1 hide-pc" src="/event/event1-mb.png" alt="Event1" />
				<img class="event-item1 hide-mb" src="/event/event1.png" alt="Event1" />
				<img class="event-item2 hide-pc" src="/event/event2-mb.png" alt="Event2" />
				<img class="event-item2 hide-mb" src="/event/event2.png" alt="Event2" />
				<img class="event-contact hide-pc" src="/event/event-contact-mb.png" alt="Event Contact" />
				<img class="event-contact hide-mb" src="/event/event-contact.png" alt="Event Contact" />
				<a href="https://pf.kakao.com/_LxkkfT" rel="noopener noreferrer" target="_blank">
					<img class="kakao-ch hide-pc" src="/event/kakao-mb.png" alt="Kakao Channel" />
				</a>
				<a href="https://pf.kakao.com/_LxkkfT" rel="noopener noreferrer" target="_blank">
					<img class="kakao-ch hide-mb" src="/event/kakao.png" alt="Kakao Channel" />
				</a>
			</div>
			<div class="imageWrapper">
				<img class="hide-pc" src="/event/cryptotax-mb.png" alt="Crypto Tax Picture" />
				<img class="hide-mb" src="/event/cryptotax.png" alt="Crypto Tax Picture" />
				<img class="hide-pc -grayscale" src="/event/group-image-mb.png" alt="Group Picture" />
				<img class="hide-mb -grayscale" src="/event/group-image.png" alt="Group Picture" />
				<img class="c-logo hide-pc" src="/event/c2021-mb.png" alt="c2021 Cointelli" />
				<img class="c-logo hide-mb" src="/event/c2021.png" alt="c2021 Cointelli" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { FINAL_PRODUCTION, IMPORT_ONLY } from '~/utils/constants';

@Component({
	layout: IMPORT_ONLY ? 'event' : '',
	meta: { auth: false },
	middleware: FINAL_PRODUCTION ? 'absoluteDenying' : '',
})
export default class Event extends Vue {}
</script>

<style lang="scss" scoped>
.-grayscale {
	filter: grayscale(1);
}

.bodyWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
}
.contentWrapper {
	padding-top: 56px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 62px;
	}
	.content-logo {
		width: 224px;
		@media (min-width: #{$breakpoint-xl}) {
			width: 238px;
			height: 18px;
		}
	}
	.content-title {
		padding-top: 14px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 26px;
		}
	}
	.content-text {
		padding-top: 33px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 32px;
		}
	}
}
.benefitsWrapper {
	padding-top: 77px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 54px;
	}
	.benefit-title {
		width: 84px;
		@media (min-width: #{$breakpoint-xl}) {
			width: 100px;
		}
	}
	.benefit-item1 {
		padding-top: 14px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 6px;
		}
	}
	.benefit-item2 {
		padding-top: 10px;
		@media (min-width: #{$breakpoint-xl}) {
			padding: 12px 0px 11px 0px;
		}
	}
	.benefit-item3 {
		padding-top: 10px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 8px;
			padding: 10px 0px;
		}
	}
}
.eventWrapper {
	margin-top: 52px;
	padding-top: 40px;
	width: 100%;
	background-color: #f5f5f5;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		margin-top: 54px;
		padding-top: 68px;
	}
	.event-logo {
		width: 224px;
		@media (min-width: #{$breakpoint-xl}) {
			width: 238px;
			height: 18px;
		}
	}
	.event-button {
		width: 326px;
		padding-top: 18px;
		cursor: pointer;
		@media (min-width: #{$breakpoint-xl}) {
			width: 400px;
			padding-top: 24px;
		}
	}
	.event-item1 {
		padding-top: 28px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 26px;
		}
	}
	.event-item2 {
		padding: 7px 0px 3px 0px;
		@media (min-width: #{$breakpoint-xl}) {
			padding: 11px 0px 10px 0px;
		}
	}
	.event-contact {
		padding-top: 22px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 18px;
		}
	}
	.kakao-ch {
		width: 192px;
		padding-top: 20px;
		padding-bottom: 28px;
		cursor: pointer;
		@media (min-width: #{$breakpoint-xl}) {
			width: 196px;
			padding-top: 22px;
			padding-bottom: 38px;
		}
	}
}
.imageWrapper {
	padding-top: 22px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
	@media (min-width: #{$breakpoint-xl}) {
		padding-top: 72px;
	}
	.c-logo {
		padding-top: 30px;
		padding-bottom: 26px;
		@media (min-width: #{$breakpoint-xl}) {
			padding-top: 40px;
			padding-bottom: 32px;
		}
	}
}
</style>
