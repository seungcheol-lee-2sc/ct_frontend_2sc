interface IResultOfAction {
	create: string;
	save: string;
	update: string;
	delete: string;
	connect: string;
	payment: string;
	login: string;
	fetch: string;
	copy: string;
	passwordUpdate: string;
	signOut: string;
	upload: string;
	submitEamil: string;
	submit: string;
	syncTarget: string;
	importTarget: string;
	import: string;
	loadAccount: string;
	loadAccounts: string;
	loadTarget: string;
	download: string;
	pay: string;
	undo: string;
	match: string;
	exclude: string;
	userData: string;
}

interface ISingleAndMultiple {
	a: string;
	multiple: string;
}

export interface ITranslation {
	menu: {
		learn: string;
		dashboard: string;
		overview: string;
		review: string;
		report: string;
		taxMinimizer: string;
		faq: string;
		features: string;
		whycointelli: string;
		howItWorks: string;
		exchanges: string;
		pricing: string;
		support: string;
		helpCenter: string;
		blog: string;
		contactUs: string;
		imports: string;
		legal: string;
		termsOfService: string;
		privacyPolicy: string;
		disclaimer: string;
		security: string;
		user: string;
		profile: string;
		plans: string;
		rewards: string;
		aboutUs: string;
		taxGuide: string;
	};
	common: {
		signIn: string;
		signOut: string;
		signUp: string;
		signUpForFree: string;
		getStartedForFree: string;
		getStarted: string;
		letsBegin: string;
		delete: string;
		targetDelete: string;
		warning: string;
		error: string;
		success: string;
		close: string;
		select: string;
		add: string;
		dropFile: string;
		or: string;
		browse: string;
		cancel: string;
		save: string;
		edit: string;
		ok: string;
		download: string;
		free: string;
		next: string;
		skip: string;
		total: string;
		send: string;
		other: string;
		copy: string;
		apply: string;
		continue: string;
		gotIt: string;
		done: string;
		areYouSure: string;
		change: string;
		files: string;
		match: string;
		confirm: string;
		undo: string;
		ignore: string;
		exclude: string;
		undoed: string;
		remove: string;
		sorry: string;
		resend: string;
		loading: string;
		back: string;
		reset: string;
		view: string;
		stop: string;
		fix: string;
	};
	message: {
		submitAlert: string;
		delete: string;
		create: string;
		update: string;
		read: string;
		success: IResultOfAction;
		fail: IResultOfAction;
		alreadyLoggedIn: string;
		confirmRedirect: string;
		syncForAll: string;
		refreshData: string;
		dashboardError1: string;
		tryAgainAfter: string;
		tryAgain: string;
		noDataAvailable: string;
		noTransactions: string;
		noTransaction: string;
		noInstruction: string;
		noHistory: string;
		noData: string;
		noDataToDelete: string;
		confirmClosing: string;
		atLeastOneTransaction: string;
		notFoundTarget: string;
		notFound: string;
		continueConnection: string;
		signOutConfirm: string;
		deleteTransactionsConfirm: string;
		paypalFailed: string;
		deleteSource: string;
		deleteSources: string;
		maxFileSize: string;
		maxFileNumber: string;
		aFileOnly: string;
		acceptableOnly: string;
		unacceptableFile: string;
		uploadSuccessfully: string;
		errorFound: ISingleAndMultiple;
		reviewItemFound: ISingleAndMultiple;
		allSet: string;
		unlockAndGetReport: string;
		unlockTaxMinimizer: string;
		refreshPage: string;
		refreshSection: string;
		choose: string;
		select: string;
		whyAsking: string;
		loggingIn: string;
		justAMoment: string;
		pwConfirmation: string;
		minCashOut: string;
		resentConfirmation: string;
		sendConfirmation: string;
		cancelConfirmation: string;
		deleteAccount: ISingleAndMultiple;
		deleteItem: ISingleAndMultiple;
		bugReportMessage: string;
		deleteAllTransactions: string;
		failToLoadData: string;
		importAccountUndeletable: string;
		incomeWarning: string;
		goodBye: string;
		stopDelete: string;
		pauseImport: string;
		failToSaveReferral: string;
	};
	rules: {
		required: string;
		exist: string;
		unique: string;
		natureNumber: string;
		email: string;
		requiredRule: string;
		pwMin: string;
		pwUppercase: string;
		pwLowercase: string;
		pwNumeric: string;
		pwSpecialChar: string;
		datetime: string;
		date: string;
		onlyNumber: string;
		sameCurrency: string;
		futureTimestamp: string;
	};
	page: {
		main: {
			section1: {
				title: string;
				desc: string;
				desc2: string;
				button: string;
			};
			section2: {
				title: string;
				desc: string;
				subDesc1: string;
				subDesc2: string;
				subDesc3: string;
				subDesc4: string;
			};
			section3: {
				title: string;
				desc: string;
				content1: {
					title: string;
					desc: string;
					link: string;
					imgText1: string;
				};
				content2: {
					title: string;
					desc: string;
					link: string;
					imgText1: string;
				};
				content3: {
					title: string;
					desc: string;
					link: string;
					imgText1: string;
				};
			};
		};
		howCointelliWorks: {
			section1: {
				title: string;
				desc: string;
			};

			section2: {
				title: string;
				desc: string;
				link: string;
			};
			section3: {
				title: string;
				desc: string;
			};

			roadSection: {
				title1: string;
				subTitle1: string;
				desc1: string;

				title2: string;
				subTitle2: string;
				desc2: string;

				title3: string;
				subTitle3: string;
				desc3: string;

				title4: string;
				subTitle4: string;
				desc4: string;
			};
		};

		aboutUs: {
			section1: {
				title: string;
				desc: string;
				italicDesc: string;
			};
			section2: {
				title: string;
				desc: string;
			};
			section3: {
				title: string;
				desc1: {
					desc1Title: string;
					desc1SubTitle: string;
					previously: string;
					desc1Desc: string;
				};
				desc2: {
					desc2Title: string;
					desc2SubTitle: string;
					desc2Desc: string;
				};
				desc3: {
					desc3Title: string;
					desc3SubTitle: string;
					desc3Desc: string;
				};
			};
			section4: {
				title: string;
				desc: string;
			};
			section5: {
				title: string;
				desc1: {
					text1: string;
					name1: string;
				};
				desc2: {
					text2: string;
					name2: string;
				};
				desc3: {
					text3: string;
					name3: string;
				};
			};
		};

		pricing: {
			section1: {
				title: string;
				desc: string;
			};
			section2: {
				card1: {
					cardInnerTitle: string;
					perTaxYear: string;
					cardInnerDesc: string;
				};
				card2: {
					cardInnerTitle: string;

					cardInnerDesc: string;
				};
				card3: {
					cardInnerTitle: string;

					cardInnerDesc: string;
				};
				desc: string;
			};
			section3: {
				title: string;
				card1: {
					title: string;
					desc: string;
				};
				card2: {
					title: string;
					desc1: string;
					desc2: string;
				};
				card3: {
					title: string;
					desc: string;
				};
				card4: {
					title: string;
					desc: string;
				};
				card5: {
					title: string;
					desc1: string;
					desc2: string;
				};
				card6: {
					title: string;
					desc: string;
				};
			};
		};

		features: {
			section1: {
				title: string;
				desc: string;
				button: string;
			};
			section2: {
				title: string;
				desc1: string;
				desc2: string;
				desc3: string;
				desc4: string;
				desc5: string;
			};
			section3: {
				title: string;
				desc: string;
			};
			section4: {
				title: string;
				desc: string;
				question1: string;
				hideDesc1: string;
				question2: string;
				hideDesc2: string;
				question3: string;
				hideDesc3: string;
			};
			section5: {
				title: string;
				desc: string;
				subDesc1: string;
				subDesc2: string;
			};
			section6: {
				title: string;
				desc1: string;
				desc2: string;
			};
			section7: {
				title: string;
				desc1: string;
				desc2: string;
				desc3: string;
			};
		};
		referSection: {
			title: string;
			subTitle: string;
			link: string;
		};
		exchanges: {};
		blog: {};
		signIn: {
			title: string;
			continueGoogle: string;
			continueApple: string;
			continueFacebook: string;
			placeholder: {
				email: string;
				password: string;
			};
			signUpFirst: string;
			reconfirm: {
				title1: string;
				title2: string;
				placeholder: string;
			};
		};
		signUp: {
			title1: string;
			title2: string;
			title3: string;
			title4: string;
			continueGoogle: string;
			continueApple: string;
			continueFacebook: string;
			continueEmail: string;
			alreadySignUp: string;
			signUpType1: {
				title: string;
				desc: string;
				btn: string;
			};
			signUpType2: {
				title: string;
				desc: string;
				btn: string;
			};
			form: {
				label1: string;
				label2: string;
				label3: string;
				label4: string;
				label5: string;
				label6: string;
				label7: string;
				label8: string;
				check1: string;
				check2: string;
				btn: string;
				legalWarning: string;
			};
			finalTab: {
				desc1: string;
				desc2: string;
				desc3: string;
				noReceive: string;
				noSignUpResult: string;
			};
			differentSoftware: string;
		};
		forgotPassword: {
			title: string;
			placeholder1: string;
			placeholder2: string;
			placeholder3: string;
			placeholder4: string;
			button1: string;
			button2: string;
			resend: string;
			updated: string;
			lego: string;
		};
		tos: {};
		privacyPolicy: {};
		disclaimer: {};
		security: {};
		contactUs: {};
		dashboard: {
			portfolio: string;
			yourAssets: string;
			greeting: string;
			summary1: string;
			summary2: string;
			summary3: string;
			summary4: string;
			Summary: {
				title: string;
				item1: string;
				item2: string;
				item3: string;
				item4: string;
				item5: string;
				item6: string;
				item7: string;
				taxSaving: string;
				button: string;
			};
			invite: {
				title: string;
				texts: string;
				button: string;
			};
			taxMinimizer: string;
		};
		import: {
			zeroState: string;
			greeting: string;
			dialogTitle: string;
			addressImporting: string;
			apiImporting: string;
			loginImporting: string;
			loginImportButton: string;
			fileImporting: string;
			manualFormImporting: string;
			templateImporting: string;
			chooseManualType: string;
			manual: {
				form: string;
				formDesc: string;
				template: string;
				templateDesc: string;
				step1: string;
				step2: string;
				step3: string;
			};
			viewTransactions: string;
			accountName: string;
			doesNotWork: string;
			guideTitle: {
				publicAddress: string;
				login: string;
				api: string;
				file: string;
				manual: string;
			};
			reimport: string;
		};
		transaction: {
			greeting: string;
			select: ISingleAndMultiple;
			addTransaction: string;
			editType: string;
		};
		overview: {
			greeting: string;
		};
		review: {
			greeting: string;
			dataMessage1: string;
			dataMessage2: string;
			dataMessage3: string;
			dataMessage4: string;
			moved: string;
			matched: string;
			confirmed: string;
			excluded: string;
			categorized: string;
			selectedItem: ISingleAndMultiple;
			actionMessage: {
				success: ISingleAndMultiple;
				fail: ISingleAndMultiple;
			};
			review1: {
				title: string;
				notice: {
					title: string;
					summary1: string;
					summary2: string;
				};
				tab1: string;
				tab2: string;
				head1: string;
				head2: string;
				head3: string;
				error1: string;
				assetSelectorPlaceholder: string;
			};
			review2: {
				title: string;
				notice: {
					title: string;
					summary1: string;
					summary2: string;
					summary3: string;
				};
				tab1: string;
				tab2: string;
				tab3: string;
				head1: string;
				head2: string;
				head3: string;
				head4: string;
				head5: string;
				head6: string;
				error1: string;
				assetSelectorPlaceholder: string;
				confirm1: {
					title: string;
					text: string;
				};
			};
			review3: {
				title: string;
				notice: {
					title: string;
					summary1: string;
					summary2: string;
					summary3: string;
					sub1: string;
					sub2: string;
					sub3: string;
				};
				tab1: string;
				tab2: string;
				tab3: string;
				head1: string;
				head2: string;
				head3: string;
				head4: string;
				head5: string;
				head6: string;
				head7: string;
			};
			review4: {
				title: string;
				notice: {
					title: string;
					summary1: string;
				};
				function1: {
					title: string;
					text: string;
					button: string;
				};
				function2: {
					title: string;
					text: string;
					button: string;
				};
			};
			review5: {
				title: string;
				notice: {
					title: string;
					summary1: string;
					summary2: string;
				};
				tab1: string;
				tab2: string;
				head1: string;
				head2: string;
				head3: string;
				head4: string;
				head5: string;
				head6: string;
				head7: string;
				error1: string;
				error2: string;
				topButton: string;
				confirm1: {
					title: string;
					text: string;
					button: string;
				};
			};
		};
		report: {
			greeting: string;
			inviteProfessional: string;
			yourTaxStrategy: string;
			strategyPlaceholder: string;
			needToReview: string;
			completeReview: string;
			descDetectedErrors: string;
			descNoDetection: string;
			reviewErrors: string;
			longTermCapitalGain: string;
			shortTermCapitalGain: string;
			checkTax: {
				title: string;
				title2: string;
				desc: string;
				button: string;
				input1: string;
				input2: string;
				result1: string;
				result2: string;
			};
			tryMinimizer: {
				title: string;
				desc: string;
				button: string;
			};
			taxInfo: {
				estimatedIntro: string;
				estimatedTitle: string;
				estimatedDesc: string;
				estimatedButton: string;
				greeting: string;
				greeting2: string;
				greeting2Etc: string;
				yourStatus: string;
				age: string;
				state: string;
				state2: string;
				annualIncome: string;
				capitalGain: string;
				longTerm: string;
				shortTerm: string;
				iNeedHelp: string;
			};
			notice: {
				title: string;
				desc: string;
				button: string;
			};
			notfound1: string;
			notfound2: string;
			notfound3: string;
			strategyConfirm: {
				title: string;
				text1: string;
				text2: string;
				info: string;
			};
			downloadList: {
				title: string;
				textButton: string;
				tab1: string;
				tab2: string;
			};
			taxMinimizer: string;
		};
		minimizer: {
			greeting: string;
			topButton: string;
			yourTaxStrategy: string;
			selectTaxStrategy: string;
			editForm: {
				title: string;
				desc: string;
			};
		};
		profile: {
			socialNotice: string;
			pageTitle: string;
			profile: string;
			setting: string;
			firstName: string;
			lastName: string;
			email: string;
			myPhone: string;
			companyName: string;
			licenseNumber: string;
			eaNumber: string;
			profession: string;
			verified: string;
			notVerified: string;
			address: string;
			companyAddress: string;
			aptEtc: string;
			city: string;
			state: string;
			country: string;
			zipPostal: string;
			uploadProfilePhoto: string;
			deleteAccount: {
				title: string;
				desc: string;
				button: string;
				textButton: string;
				ask: string;
				placeholder: string;
				validation1: string;
				selectList: {
					reason1: string;
					reason2: string;
					reason3: string;
					reason4: string;
				};
				checkAgain: string;
			};
			changePassword: {
				title: string;
				current: string;
				newPassword: string;
				newPasswordConfirm: string;
			};
			paypal: {
				title: string;
				desc: string;
				button: string;
				chip: string;
			};
			notification: {
				title: string;
				item1: string;
				item2: string;
			};
			deleteData: {
				title: string;
				desc: string;
				button: string;
			};
			signOut: {
				title: string;
				desc: string;
				button: string;
			};
		};
		rewards: {
			pageTitle: string;
			tab1: string;
			tab2: string;
			title: string;
			subtitle: string;
			link: string;
			redeem: {
				button: string;
				alert: string;
				info1: string;
				info2: string;
				info3: string;
				dialog: {
					title: string;
					desc: string;
					input: string;
					detail: string;
				};
			};
			sendTo: string;
			errorStateMsg: string;
			notReady1: {
				msg: string;
				btn: string;
			};
			notReady2: {
				msg: string;
				btn: string;
			};
			notReady3: {
				msg: string;
				btn: string;
			};
			notReady4: {
				msg: string;
				btn: string;
			};
			history: {
				title: string;
				head1: string;
				head2: string;
				head3: string;
				head4: string;
			};
		};
		enterprise: {
			agreements: string;
		};
	};
	market: {
		countInMeSection: {
			title: string;
			desc: string;
			button: string;
		};
		consentPolicies: string;
		termsOfService: string;
		privacyPolicy: string;
		disclaimer: string;
		security: string;
	};
	product: {
		searchUser: {
			error1: string;
			error2: string;
			error3: string;
		};
		importWatcher: {
			error1: string;
			error2: string;
		};
		fifo: string;
		hifo: string;
		lifo: string;
		custom: string;
		incoming: string;
		outgoing: string;
		seeAll: string;
		step1: string;
		step2: string;
		step3: string;
		step4: string;
		exchange: string;
		wallet: string;
		blockchain: string;
		service: string;
		totalTransactions: string;
		viewTransactions: string;
		transaction: string;
		transactions: string;
		publicAddress: string;
		symbol: string;
		auto: string;
		manual: string;
		template: string;
		file: string;
		import: string;
		recommanded: string;
		tooltip: {
			timezone1: string;
			timezone2: string;
			import1: string;
			importList1: string;
			importList2: string;
			report1: string;
			report2: string;
			report3: string;
			report4: string;
			download1: string;
			category1: string;
			category2: string;
			category3: string;
			longtermGain: string;
			shorttermGain: string;
			ordinaryIncome: string;
			totalRealizedCapitalGains: string;
			totalUnrealizedLosses: string;
			taxInformation: string;
			taxInformation2: string;
			taxInformation3: string;
		};
		currency: string;
		address: string;
		timezone: string;
		lastUpdated: string;
		nextStep: string;
		prevStep: string;
		date: string;
		category: string;
		account: string;
		platform: string;
		type: string;
		required: string;
		inCurrency: string;
		inAmount: string;
		inQuantity: string;
		outCurrency: string;
		outAmount: string;
		outQuantity: string;
		feeCurrency: string;
		feeAmount: string;
		feeQuantity: string;
		details: string;
		comment: string;
		fee: string;
		review: string;
		report: string;
		million: string;
		plan: {
			name: string;
			selectYourPlan: string;
			selectedPlan: {
				title: string;
				subtitle: string;
				link: string;
			};
			currentPlan: string;
			order: string;
			disclaimer: string;
			summary: string;
			subtotal: string;
			discount: string;
			tax: string;
			total: string;
			year: string;
		};
		apply: string;
		applied: string;
		coupon: string;
		promo: {
			question: string;
			button: string;
			code: string;
			selectCode: string;
			discountText: string;
			noAvailable: string;
			coupon: string;
			applied: string;
		};
		referrals: string;
		publicAddressInfo: string;
		capitalGain: string;
		yearSummary: string;
		countryCode: string;
		quickGuide: string;
		bugReport: {
			title: string;
			desc: string;
			placeholder1: string;
			placeholder2: string;
			placeholder3: string;
			label1: string;
			label2: string;
			label3: string;
			select1: string;
			select2: string;
			select3: string;
			select4: string;
			select5: string;
			select6: string;
			select7: string;
			unknownFile: string;
			unknownFile2: string;
		};
		inviteYourClient: string;
	};
	placeholder: {
		timezone: string;
	};
	welcome: {
		greeting: {
			title: string;
			desc1: string;
			desc2: string;
		};
		greetingPro: {
			title: string;
			feature1: {
				title: string;
				desc: string;
			};
			feature2: {
				title: string;
				desc: string;
			};
			feature3: {
				title: string;
				desc: string;
			};
		};
		agree: {
			title: string;
			agreement: string;
			checkbox2: string;
		};
		country: {
			title: string;
			desc: string;
			placeholder: string;
			warn: {
				title: string;
				desc: string;
				feature1: string;
				feature2: string;
				feature3: string;
				feature4: string;
			};
		};
		tour: {
			skip: string;
			step1: {
				title: string;
				desc: string;
			};
			step2: {
				title: string;
				desc: string;
			};
			step3: {
				title: string;
				desc: string;
			};
			step1Pro: {
				title: string;
				desc: string;
			};
			step2Pro: {
				title: string;
				desc: string;
			};
		};
	};
}
