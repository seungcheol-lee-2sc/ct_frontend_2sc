export interface IConfirmSignUpDTO {
	username: string;
	code: string;
}

export interface ISubmitForgotPwDTO {
	username: string;
	code: string;
	newPassword: string;
}

export interface IChangePasswordDTO {
	oldPassword: string;
	newPassword: string;
}
