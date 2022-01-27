export const jsonToQuery = (obj: object): string => {
	let query = '';
	const keys = Object.keys(obj);
	if (keys.length > 0) {
		query += '?';
		keys.forEach((key, idx) => {
			const value = (<any>obj)[key];
			query += `${key}=${value}`;
			if (idx !== keys.length - 1) {
				query += '&';
			}
		});
	}
	return query;
};

export const getSingleItem = (item: any): any => {
	return item && typeof item === 'object' && item.length >= 0 ? item[0] : item;
};

export const getJsonFromHash = (hash: string) => {
	const result: any = {};
	hash
		.replace('#', '')
		.split('&')
		.forEach(h => {
			const splitted = h.split('=');
			const key = splitted[0];
			const value = splitted[1];
			result[key] = value;
		});
	return result;
};

export const fileListToArr = (fileList: FileList): File[] => {
	const result: File[] = [];

	// @ts-ignore
	for (const file of fileList) {
		result.push(file);
	}

	return result;
};

export const uniqueKeyChecker = (arr: any[], key: string) => {
	const filtered = arr.map(v => v[key]).filter(v => v);
	const set = new Set(filtered);
	return Boolean([...set].length > 1);
};

// Get query from data to url
export const querySyncer = (params: any, router: any, route: any): void => {
	const query: any = {};
	Object.keys(params).forEach((key: any) => {
		// @ts-ignore
		const value: any = params[key];
		if (value || value === 0) {
			query[key] = String(value);
		}
	});
	JSON.stringify(route.query) !== JSON.stringify(query) && router.replace({ query });
};

// Get query from url to data
export const qeuryMapper = (query: any, params: any): any => {
	const newParams = params;
	Object.keys(query).forEach(queryName => {
		if (queryName in newParams) {
			newParams[queryName] = query[queryName];
		}
	});
	return newParams;
};

export const shufflingArray = (arr: any[]) => {
	return arr.sort(() => Math.random() - 0.5);
};
