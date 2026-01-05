/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface IAmplitudeCredentials {
	apiKey: string;
	secretKey: string;
	region: 'us' | 'eu';
}

export interface IAmplitudeEvent {
	user_id?: string;
	device_id?: string;
	event_type: string;
	time?: number;
	event_properties?: IDataObject;
	user_properties?: IDataObject;
	groups?: IDataObject;
	group_properties?: IDataObject;
	app_version?: string;
	platform?: string;
	os_name?: string;
	os_version?: string;
	device_brand?: string;
	device_manufacturer?: string;
	device_model?: string;
	carrier?: string;
	country?: string;
	region?: string;
	city?: string;
	dma?: string;
	language?: string;
	price?: number;
	quantity?: number;
	revenue?: number;
	productId?: string;
	revenueType?: string;
	location_lat?: number;
	location_lng?: number;
	ip?: string;
	idfa?: string;
	idfv?: string;
	adid?: string;
	android_id?: string;
	event_id?: number;
	session_id?: number;
	insert_id?: string;
	library?: string;
	partner_id?: string;
	plan?: IDataObject;
}

export interface IAmplitudeEventBatch {
	api_key: string;
	events: IAmplitudeEvent[];
	options?: {
		min_id_length?: number;
	};
}

export interface IAmplitudeIdentify {
	api_key: string;
	identification: IAmplitudeIdentification[];
}

export interface IAmplitudeIdentification {
	user_id?: string;
	device_id?: string;
	user_properties?: IDataObject;
	groups?: IDataObject;
	app_version?: string;
	platform?: string;
	os_name?: string;
	os_version?: string;
	device_brand?: string;
	device_manufacturer?: string;
	device_model?: string;
	carrier?: string;
	country?: string;
	region?: string;
	city?: string;
	dma?: string;
	language?: string;
	paying?: string;
	start_version?: string;
}

export interface IAmplitudeGroupIdentify {
	api_key: string;
	identification: IAmplitudeGroupIdentification[];
}

export interface IAmplitudeGroupIdentification {
	group_type: string;
	group_value: string;
	group_properties?: IDataObject;
}

export interface IAmplitudeRevenue {
	user_id?: string;
	device_id?: string;
	event_type: string;
	revenue: number;
	productId?: string;
	quantity?: number;
	price?: number;
	revenueType?: string;
	event_properties?: IDataObject;
	user_properties?: IDataObject;
}

export interface IAmplitudeDashboardQuery {
	e?: IDataObject;
	s?: IDataObject[];
	start?: string;
	end?: string;
	m?: string;
	i?: string;
	g?: string;
	limit?: number;
}

export interface IAmplitudeEventSegmentation {
	e: IDataObject;
	start: string;
	end: string;
	m?: string;
	i?: string;
	s?: IDataObject[];
	g?: string;
	limit?: number;
}

export interface IAmplitudeFunnelAnalysis {
	e: string;
	start: string;
	end: string;
	mode?: string;
	n?: string;
	s?: IDataObject[];
	g?: string;
}

export interface IAmplitudeRetentionAnalysis {
	se: IDataObject;
	re: IDataObject;
	start: string;
	end: string;
	rm?: string;
	rb?: number;
	s?: IDataObject[];
}

export interface IAmplitudeTaxonomyEventType {
	event_type: string;
	category?: string;
	description?: string;
	display_name?: string;
}

export interface IAmplitudeTaxonomyProperty {
	event_type?: string;
	property_name: string;
	property_type?: string;
	description?: string;
	is_required?: boolean;
	is_blocked?: boolean;
	regex?: string;
	enum_values?: string[];
}

export interface IAmplitudeCohort {
	id?: string;
	name: string;
	description?: string;
	definition?: IDataObject;
	sync_id?: string;
	app_id?: number;
}

export interface IAmplitudeUserSearch {
	user: string;
	amplitude_id?: number;
	start_time?: string;
	end_time?: string;
	limit?: number;
}

export interface IAmplitudeExportParams {
	start: string;
	end: string;
}

export interface IAmplitudeApiResponse {
	code?: number;
	status?: string;
	events_ingested?: number;
	payload_size_bytes?: number;
	server_upload_time?: number;
	error?: string;
	missing_field?: string;
	events_with_invalid_fields?: IDataObject;
	events_with_missing_fields?: IDataObject;
	events_with_invalid_id_lengths?: IDataObject;
	silenced_events?: string[];
	throttled_events?: string[];
	exceeded_daily_quota_devices?: IDataObject;
	exceeded_daily_quota_users?: IDataObject;
}

export type AmplitudeResource = 'event' | 'dashboard' | 'taxonomy' | 'cohort' | 'user' | 'export';

export type EventOperation = 'send' | 'sendBatch' | 'identify' | 'groupIdentify' | 'revenue';

export type DashboardOperation =
	| 'eventSegmentation'
	| 'funnelAnalysis'
	| 'retentionAnalysis'
	| 'userSessions'
	| 'userComposition'
	| 'eventList'
	| 'exportChart'
	| 'getDataTables';

export type TaxonomyOperation =
	| 'getEventTypes'
	| 'createEventType'
	| 'updateEventType'
	| 'deleteEventType'
	| 'getEventProperties'
	| 'createEventProperty'
	| 'getUserProperties'
	| 'createUserProperty'
	| 'getGroupProperties';

export type CohortOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete' | 'download';

export type UserOperation = 'search' | 'getActivity' | 'getUserProperties' | 'updateUserProperties';

export type ExportOperation = 'exportEvents' | 'exportUserData';
