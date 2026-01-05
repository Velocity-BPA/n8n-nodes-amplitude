/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import type { IAmplitudeCredentials, IAmplitudeEvent } from './types/AmplitudeTypes';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

/**
 * Get base URL based on region and API type
 */
export function getBaseUrl(region: 'us' | 'eu', apiType: 'http' | 'dashboard' | 'taxonomy'): string {
	if (apiType === 'http') {
		return region === 'eu' ? 'https://api.eu.amplitude.com' : 'https://api2.amplitude.com';
	}
	if (apiType === 'taxonomy') {
		return region === 'eu' ? 'https://analytics.eu.amplitude.com' : 'https://amplitude.com';
	}
	// Dashboard API
	return region === 'eu' ? 'https://analytics.eu.amplitude.com' : 'https://amplitude.com';
}

/**
 * Generate a unique insert_id for event deduplication
 */
export function generateInsertId(userId: string): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 10);
	return `${userId}_${timestamp}_${random}`;
}

/**
 * Sleep for exponential backoff
 */
async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Make HTTP V2 API request (for event tracking)
 */
export async function amplitudeHttpApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	_qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = (await this.getCredentials('amplitudeApi')) as IAmplitudeCredentials;
	const baseUrl = getBaseUrl(credentials.region, 'http');

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	let lastError: Error | undefined;

	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			const response = await this.helpers.httpRequest(options);
			return response as IDataObject;
		} catch (error) {
			lastError = error as Error;
			const statusCode = (error as JsonObject)?.statusCode as number | undefined;

			if (statusCode === 429) {
				// Rate limited - wait with exponential backoff
				const delay = BASE_DELAY_MS * Math.pow(2, attempt);
				await sleep(delay);
				continue;
			}

			if (statusCode && statusCode >= 500) {
				// Server error - retry
				const delay = BASE_DELAY_MS * Math.pow(2, attempt);
				await sleep(delay);
				continue;
			}

			// Client error or other - don't retry
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	throw new NodeApiError(this.getNode(), lastError as unknown as JsonObject);
}

/**
 * Make Dashboard API request (requires Basic Auth)
 */
export async function amplitudeDashboardApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = (await this.getCredentials('amplitudeApi')) as IAmplitudeCredentials;
	const baseUrl = getBaseUrl(credentials.region, 'dashboard');

	// Create Basic Auth header
	const authString = Buffer.from(`${credentials.apiKey}:${credentials.secretKey}`).toString(
		'base64',
	);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			Authorization: `Basic ${authString}`,
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	if (method !== 'GET' && Object.keys(body).length > 0) {
		options.body = body;
	}

	let lastError: Error | undefined;

	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			const response = await this.helpers.httpRequest(options);
			return response as IDataObject;
		} catch (error) {
			lastError = error as Error;
			const statusCode = (error as JsonObject)?.statusCode as number | undefined;

			if (statusCode === 429) {
				// Rate limited - wait with exponential backoff
				const delay = BASE_DELAY_MS * Math.pow(2, attempt);
				await sleep(delay);
				continue;
			}

			if (statusCode && statusCode >= 500) {
				// Server error - retry
				const delay = BASE_DELAY_MS * Math.pow(2, attempt);
				await sleep(delay);
				continue;
			}

			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	throw new NodeApiError(this.getNode(), lastError as unknown as JsonObject);
}

/**
 * Make Taxonomy API request
 */
export async function amplitudeTaxonomyApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = (await this.getCredentials('amplitudeApi')) as IAmplitudeCredentials;
	const baseUrl = getBaseUrl(credentials.region, 'taxonomy');

	// Create Basic Auth header
	const authString = Buffer.from(`${credentials.apiKey}:${credentials.secretKey}`).toString(
		'base64',
	);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			Authorization: `Basic ${authString}`,
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	if (method !== 'GET' && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Build an event object from node parameters
 */
export function buildEventObject(
	eventType: string,
	userId?: string,
	deviceId?: string,
	eventProperties?: IDataObject,
	userProperties?: IDataObject,
	additionalFields?: IDataObject,
): IAmplitudeEvent {
	if (!userId && !deviceId) {
		throw new NodeOperationError(
			{ name: 'Amplitude', type: 'n8n-nodes-amplitude.amplitude' } as any,
			'Either user_id or device_id must be provided',
		);
	}

	const event: IAmplitudeEvent = {
		event_type: eventType,
		time: Date.now(),
	};

	if (userId) {
		event.user_id = userId;
		event.insert_id = generateInsertId(userId);
	}

	if (deviceId) {
		event.device_id = deviceId;
		if (!userId) {
			event.insert_id = generateInsertId(deviceId);
		}
	}

	if (eventProperties && Object.keys(eventProperties).length > 0) {
		event.event_properties = eventProperties;
	}

	if (userProperties && Object.keys(userProperties).length > 0) {
		event.user_properties = userProperties;
	}

	if (additionalFields) {
		const fieldMappings: { [key: string]: keyof IAmplitudeEvent } = {
			sessionId: 'session_id',
			platform: 'platform',
			osName: 'os_name',
			osVersion: 'os_version',
			deviceBrand: 'device_brand',
			deviceManufacturer: 'device_manufacturer',
			deviceModel: 'device_model',
			carrier: 'carrier',
			country: 'country',
			region: 'region',
			city: 'city',
			dma: 'dma',
			language: 'language',
			ip: 'ip',
			appVersion: 'app_version',
			eventId: 'event_id',
		};

		for (const [inputKey, eventKey] of Object.entries(fieldMappings)) {
			if (additionalFields[inputKey] !== undefined && additionalFields[inputKey] !== '') {
				(event as any)[eventKey] = additionalFields[inputKey];
			}
		}

		// Handle custom time if provided
		if (additionalFields.time) {
			event.time = new Date(additionalFields.time as string).getTime();
		}
	}

	return event;
}

/**
 * Validate user/device ID length (minimum 5 characters)
 */
export function validateIdLength(id: string, idType: string): void {
	if (id && id.length < 5) {
		throw new NodeOperationError(
			{ name: 'Amplitude', type: 'n8n-nodes-amplitude.amplitude' } as any,
			`${idType} must be at least 5 characters long`,
		);
	}
}

/**
 * Parse date string to Amplitude format (YYYYMMDD)
 */
export function formatDateForAmplitude(dateStr: string): string {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}${month}${day}`;
}

/**
 * Parse datetime string to Amplitude export format (YYYYMMDDTHH)
 */
export function formatDateTimeForAmplitude(dateStr: string): string {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hour = String(date.getUTCHours()).padStart(2, '0');
	return `${year}${month}${day}T${hour}`;
}

/**
 * Build segments array for dashboard queries
 */
export function buildSegments(segmentDefinitions: IDataObject[]): IDataObject[] {
	return segmentDefinitions.map((segment) => ({
		prop: segment.property,
		op: segment.operator,
		values: Array.isArray(segment.values)
			? segment.values
			: String(segment.values)
					.split(',')
					.map((v) => v.trim()),
	}));
}

/**
 * Build event definition for dashboard queries
 */
export function buildEventDefinition(
	eventType: string,
	groupBy?: string[],
	filters?: IDataObject[],
): IDataObject {
	const eventDef: IDataObject = {
		event_type: eventType,
	};

	if (groupBy && groupBy.length > 0) {
		eventDef.group_by = groupBy.map((g) => ({
			type: 'event',
			value: g,
		}));
	}

	if (filters && filters.length > 0) {
		eventDef.filters = filters.map((f) => ({
			subprop_type: f.propertyType || 'event',
			subprop_key: f.property,
			subprop_op: f.operator,
			subprop_value: Array.isArray(f.values)
				? f.values
				: String(f.values)
						.split(',')
						.map((v) => v.trim()),
		}));
	}

	return eventDef;
}
