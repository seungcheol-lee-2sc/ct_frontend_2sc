import { EJobStatus } from '../provider/types';

export interface IJobCondition {
	jobId: string;
	login: string;
	progress: number;
	status: EJobStatus;
	userId: string;
}
