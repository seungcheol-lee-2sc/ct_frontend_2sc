import { GetterTree, ActionTree, MutationTree } from 'vuex';
import momentTimezone from 'moment-timezone';
import {
	DConfirmation,
	DSigningError,
	IConfirmation,
	IMessageItem,
	ISigningError,
	ITimeZone,
} from '~/types/common/types';

export const POP_ACTION_SNACK = 'POP_ACTION_SNACK';
export const CLOSE_ACTION_SNACK_BAR = 'CLOSE_ACTION_SNACK_BAR';
export const PC = 'PC';
export const MB = 'MB';
export const LOADING = 'LOADING';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const CUSTOM_CONFIRM_ACTION = 'CUSTOM_CONFIRM_ACTION';
export const CONFIRM_ACTION = 'CONFIRM_ACTION';
export const CONFIRM_ERROR = 'CONFIRM_ERROR';
export const CLOSE_CONFIRMATION = 'CLOSE_CONFIRMATION';
export const PAGE_LOADER = 'PAGE_LOADER';
export const OPEN_BUG_REPORTER = 'OPEN_BUG_REPORTER';
export const CLOSE_BUG_REPORTER = 'CLOSE_BUG_REPORTER';
export const OPEN_GUIDE_MAP = 'OPEN_GUIDE_MAP';
export const CLOSE_GUIDE_MAP = 'CLOSE_GUIDE_MAP';
export const REMOVE_FROM_QUEUE = 'REMOVE_FROM_QUEUE';
export const ADD_TO_MESSAGE_QUEUE = 'ADD_TO_MESSAGE_QUEUE';
export const ADD_TO_CLOSING_QUEUE = 'ADD_TO_CLOSING_QUEUE';
export const OPEN_SIGNING_ERROR = 'OPEN_SIGNING_ERROR';
export const CLOSE_SIGNING_ERROR = 'CLOSE_SIGNING_ERROR';

export const DSnackDuration = 5000;

export const state = () => ({
	closingMessageIds: [] as string[],
	messageQueue: [] as IMessageItem[],
	guidMapOpen: false as boolean,
	pageLoading: true as boolean,
	confirmation: DConfirmation as IConfirmation,
	signingError: DSigningError as ISigningError,
	isMobile: true as boolean | null,
	appDrawer: true as boolean,
	timeZoneLists: momentTimezone.tz
		.names()
		.map(v => {
			const format = momentTimezone.tz(v).format('Z');
			return { name: v, format, shownName: `${format} ${v}` };
		})
		.sort((a, b) => (a.shownName > b.shownName ? 1 : -1)) as ITimeZone[],
	bugReportDialog: false as boolean,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {};

export const mutations: MutationTree<RootState> = {
	[OPEN_SIGNING_ERROR]: (state, payload: ISigningError) => {
		if (!payload.text) return;
		state.signingError = {
			...payload,
			dialog: true,
		};
	},
	[CLOSE_SIGNING_ERROR]: state => {
		state.signingError = {
			dialog: false,
			text: '',
			linkPath: '',
			linkText: '',
		};
	},
	[ADD_TO_CLOSING_QUEUE]: (state, messageId: string) => {
		state.closingMessageIds.push(messageId);
	},
	[ADD_TO_MESSAGE_QUEUE]: (state, payload: IMessageItem) => {
		state.messageQueue.push(payload);
	},
	[REMOVE_FROM_QUEUE]: (state, messageId: string) => {
		const foundIndex = state.messageQueue.findIndex(v => v.id === messageId);
		state.messageQueue.splice(foundIndex, 1);
		const foundIndex2 = state.closingMessageIds.findIndex(v => v === messageId);
		state.closingMessageIds.splice(foundIndex2, 1);
	},
	[OPEN_GUIDE_MAP]: state => {
		state.guidMapOpen = true;
	},
	[CLOSE_GUIDE_MAP]: state => {
		state.guidMapOpen = false;
	},
	[CLOSE_BUG_REPORTER]: state => {
		state.bugReportDialog = false;
	},
	[OPEN_BUG_REPORTER]: state => {
		state.bugReportDialog = true;
	},
	[PAGE_LOADER]: (state, payload: boolean) => {
		state.pageLoading = payload;
	},

	[CLOSE_CONFIRMATION]: state => {
		state.confirmation = DConfirmation;
	},
	[CUSTOM_CONFIRM_ACTION]: (state, payload: IConfirmation) => {
		state.confirmation = DConfirmation;
		state.confirmation = payload;
	},
	[CONFIRM_ACTION]: (state, payload: IConfirmation) => {
		state.confirmation = DConfirmation;
		// payload: "title", "text" and "pending" are needed
		state.confirmation = {
			...payload,
			btnText: 'OK',
			dialog: true,
			cancelBtn: true,
		};
	},
	[CONFIRM_ERROR]: (state, payload: IConfirmation) => {
		state.confirmation = DConfirmation;
		// payload: "title", "text" are needed
		state.confirmation = {
			...payload,
			btnText: 'OK',
			dialog: true,
			cancelBtn: false,
			pending: DConfirmation.pending,
		};
	},
	[PC]: state => {
		state.isMobile = false;
	},
	[MB]: state => {
		state.isMobile = true;
	},
	[OPEN_DRAWER]: state => {
		state.appDrawer = true;
	},
	[CLOSE_DRAWER]: state => {
		state.appDrawer = false;
	},
};

export const actions: ActionTree<RootState, RootState> = {
	[ADD_TO_MESSAGE_QUEUE]: (
		{ state, commit, dispatch },
		{
			msg,
			color,
			manual,
			actionText,
			action,
		}: { msg: string; color: string; manual: boolean; actionText?: string; action?: () => any },
	): string => {
		const id = `${new Date().valueOf()}-${state.messageQueue.length}`;
		const messageItem: IMessageItem = {
			id,
			msg,
			color,
			closer: manual
				? null
				: setTimeout(() => {
						dispatch(ADD_TO_CLOSING_QUEUE, id);
				  }, 5000),
			actionText,
			action,
		};
		commit(ADD_TO_MESSAGE_QUEUE, messageItem);
		return id;
	},
	[ADD_TO_CLOSING_QUEUE]: ({ commit }, messageId: number) => {
		commit(ADD_TO_CLOSING_QUEUE, messageId);
		setTimeout(() => {
			commit(REMOVE_FROM_QUEUE, messageId);
		}, 300);
	},
};
