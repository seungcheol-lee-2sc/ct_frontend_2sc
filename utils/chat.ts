export const DConversationSetting = {
	loadImmediately: false,
};

/**
 * @param newThread boolean : Whether to force a new thread to be created
 * -> Refresh and re-render the widget's information, given the current page URL.
 */
export const refreshWidget = (newThread = false) => {
	// @ts-ignore
	window.HubSpotConversations.widget.refresh({ openToNewThread: newThread });
};

export const openWidget = () => {
	// @ts-ignore
	window.HubSpotConversations.widget.open();
};

export const closeWidget = () => {
	// @ts-ignore
	window.HubSpotConversations.widget.close();
};

export const loadWidget = () => {
	// @ts-ignore
	window.HubSpotConversations.widget.load();
};

export const launchWidget = (options = {}) => {
	// @ts-ignore
	window.hsConversationsSettings = {
		...DConversationSetting,
		...options,
	};
	loadWidget();
};

/**
 * Remove the widget from the page.
 * If the widget is not present on the page, this is a no-op.
 * To display the widget again, a full page refresh will have to occur, or one can invoke widget.load().
 */
export const removeWidget = () => {
	// @ts-ignore
	window.HubSpotConversations.widget.remove();
};

/**
 * @returns Widget was loaded or not. (boolean)
 */
export const widgetStatus = () => {
	// @ts-ignore
	const status = window.HubSpotConversations.widget.status();
	return status.loaded;
};

/**
 * The chat widget creates several cookies to preserve its state across site visits and page refreshes.
 * These cookies are scoped to the domain of the page hosting the widget
 */
export const clearWidgetCookies = (reset = false) => {
	// @ts-ignore
	window.HubSpotConversations.clear({ resetWidget: reset });
};
