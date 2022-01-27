export const blurEveryInputs = () => {
	document?.querySelectorAll('input').forEach((inputTag: HTMLInputElement) => {
		inputTag.blur();
	});
};

export const activateInputs = (wrapper: HTMLElement | HTMLFormElement) => {
	const inputs: NodeListOf<HTMLInputElement> = wrapper?.querySelectorAll('input') || [];
	for (let i = 0; i < inputs.length; i++) {
		const input = inputs[i];
		input.focus();
	}

	setTimeout(() => {
		wrapper.click();
	}, 0);
};

export const copyUrltoClipboard = (text: string): boolean => {
	try {
		const tempElem = document.createElement('textarea');
		tempElem.value = text;
		document.body.appendChild(tempElem);
		tempElem.select();
		document.execCommand('copy');
		document.body.removeChild(tempElem);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
