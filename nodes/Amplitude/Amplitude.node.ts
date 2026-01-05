/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	amplitudeHttpApiRequest,
	amplitudeDashboardApiRequest,
	amplitudeTaxonomyApiRequest,
	buildEventObject,
	validateIdLength,
	formatDateForAmplitude,
	formatDateTimeForAmplitude,
	buildEventDefinition,
} from './GenericFunctions';

import { eventOperations, eventFields } from './descriptions/EventDescription';
import { dashboardOperations, dashboardFields } from './descriptions/DashboardDescription';
import { taxonomyOperations, taxonomyFields } from './descriptions/TaxonomyDescription';
import { cohortOperations, cohortFields } from './descriptions/CohortDescription';
import { userOperations, userFields } from './descriptions/UserDescription';
import { exportOperations, exportFields } from './descriptions/ExportDescription';

import type { IAmplitudeCredentials, IAmplitudeEvent } from './types/AmplitudeTypes';

// Log licensing notice once on module load
const LICENSING_LOGGED = Symbol.for('amplitude.licensing.logged');
if (!(global as any)[LICENSING_LOGGED]) {
	console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
	(global as any)[LICENSING_LOGGED] = true;
}

export class Amplitude implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Amplitude',
		name: 'amplitude',
		icon: 'file:amplitude.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the Amplitude API for product analytics',
		defaults: {
			name: 'Amplitude',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'amplitudeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Cohort',
						value: 'cohort',
						description: 'Manage user cohorts',
					},
					{
						name: 'Dashboard',
						value: 'dashboard',
						description: 'Run dashboard queries and analytics',
					},
					{
						name: 'Event',
						value: 'event',
						description: 'Track and send events',
					},
					{
						name: 'Export',
						value: 'export',
						description: 'Export raw data',
					},
					{
						name: 'Taxonomy',
						value: 'taxonomy',
						description: 'Manage event and property taxonomy',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Search and manage users',
					},
				],
				default: 'event',
			},
			...eventOperations,
			...eventFields,
			...dashboardOperations,
			...dashboardFields,
			...taxonomyOperations,
			...taxonomyFields,
			...cohortOperations,
			...cohortFields,
			...userOperations,
			...userFields,
			...exportOperations,
			...exportFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = (await this.getCredentials('amplitudeApi')) as IAmplitudeCredentials;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ----------------------------------------
				//              Event Resource
				// ----------------------------------------
				if (resource === 'event') {
					if (operation === 'send') {
						const eventType = this.getNodeParameter('eventType', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const eventPropertiesRaw = this.getNodeParameter('eventProperties', i) as string;
						const userPropertiesRaw = this.getNodeParameter('userProperties', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						if (userId) validateIdLength(userId, 'user_id');
						if (deviceId) validateIdLength(deviceId, 'device_id');

						const eventProperties = eventPropertiesRaw ? JSON.parse(eventPropertiesRaw) : {};
						const userProperties = userPropertiesRaw ? JSON.parse(userPropertiesRaw) : {};

						const event = buildEventObject(
							eventType,
							userId,
							deviceId,
							eventProperties,
							userProperties,
							additionalFields,
						);

						const body = {
							api_key: credentials.apiKey,
							events: [event],
						};

						responseData = await amplitudeHttpApiRequest.call(this, 'POST', '/2/httpapi', body);
					}

					if (operation === 'sendBatch') {
						const eventsRaw = this.getNodeParameter('events', i) as string;
						const events = JSON.parse(eventsRaw) as IAmplitudeEvent[];

						if (!Array.isArray(events) || events.length === 0) {
							throw new NodeOperationError(this.getNode(), 'Events must be a non-empty array');
						}

						// Add insert_id to events that don't have one
						const processedEvents = events.map((event) => {
							if (!event.insert_id && (event.user_id || event.device_id)) {
								event.insert_id = `${event.user_id || event.device_id}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
							}
							return event;
						});

						const body = {
							api_key: credentials.apiKey,
							events: processedEvents,
						};

						responseData = await amplitudeHttpApiRequest.call(this, 'POST', '/2/httpapi', body);
					}

					if (operation === 'identify') {
						const userId = this.getNodeParameter('userId', i) as string;
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const userPropertiesRaw = this.getNodeParameter('userProperties', i) as string;
						const groupsRaw = this.getNodeParameter('groups', i) as string;
						const additionalFields = this.getNodeParameter('identifyAdditionalFields', i) as IDataObject;

						if (userId) validateIdLength(userId, 'user_id');
						if (deviceId) validateIdLength(deviceId, 'device_id');

						const userProperties = userPropertiesRaw ? JSON.parse(userPropertiesRaw) : {};
						const groups = groupsRaw ? JSON.parse(groupsRaw) : {};

						const identification: IDataObject = {
							user_properties: { $set: userProperties },
						};

						if (userId) identification.user_id = userId;
						if (deviceId) identification.device_id = deviceId;
						if (Object.keys(groups).length > 0) identification.groups = groups;

						// Add additional fields
						if (additionalFields.appVersion) identification.app_version = additionalFields.appVersion;
						if (additionalFields.platform) identification.platform = additionalFields.platform;
						if (additionalFields.osName) identification.os_name = additionalFields.osName;
						if (additionalFields.osVersion) identification.os_version = additionalFields.osVersion;
						if (additionalFields.country) identification.country = additionalFields.country;
						if (additionalFields.region) identification.region = additionalFields.region;
						if (additionalFields.city) identification.city = additionalFields.city;
						if (additionalFields.language) identification.language = additionalFields.language;
						if (additionalFields.paying) identification.paying = additionalFields.paying;
						if (additionalFields.startVersion) identification.start_version = additionalFields.startVersion;

						const body = {
							api_key: credentials.apiKey,
							identification: [identification],
						};

						responseData = await amplitudeHttpApiRequest.call(this, 'POST', '/identify', body);
					}

					if (operation === 'groupIdentify') {
						const groupType = this.getNodeParameter('groupType', i) as string;
						const groupValue = this.getNodeParameter('groupValue', i) as string;
						const groupPropertiesRaw = this.getNodeParameter('groupProperties', i) as string;

						const groupProperties = groupPropertiesRaw ? JSON.parse(groupPropertiesRaw) : {};

						const body = {
							api_key: credentials.apiKey,
							identification: [
								{
									group_type: groupType,
									group_value: groupValue,
									group_properties: { $set: groupProperties },
								},
							],
						};

						responseData = await amplitudeHttpApiRequest.call(this, 'POST', '/groupidentify', body);
					}

					if (operation === 'revenue') {
						const userId = this.getNodeParameter('userId', i) as string;
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const revenue = this.getNodeParameter('revenue', i) as number;
						const eventPropertiesRaw = this.getNodeParameter('eventProperties', i) as string;
						const revenueFields = this.getNodeParameter('revenueAdditionalFields', i) as IDataObject;

						if (userId) validateIdLength(userId, 'user_id');
						if (deviceId) validateIdLength(deviceId, 'device_id');

						const eventProperties = eventPropertiesRaw ? JSON.parse(eventPropertiesRaw) : {};

						const event: IAmplitudeEvent = {
							event_type: (revenueFields.eventType as string) || 'revenue_amount',
							revenue,
							time: Date.now(),
						};

						if (userId) {
							event.user_id = userId;
							event.insert_id = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
						}
						if (deviceId) {
							event.device_id = deviceId;
							if (!userId) {
								event.insert_id = `${deviceId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
							}
						}

						if (revenueFields.productId) event.productId = revenueFields.productId as string;
						if (revenueFields.quantity) event.quantity = revenueFields.quantity as number;
						if (revenueFields.price) event.price = revenueFields.price as number;
						if (revenueFields.revenueType) event.revenueType = revenueFields.revenueType as string;

						if (Object.keys(eventProperties).length > 0) {
							event.event_properties = eventProperties;
						}

						const body = {
							api_key: credentials.apiKey,
							events: [event],
						};

						responseData = await amplitudeHttpApiRequest.call(this, 'POST', '/2/httpapi', body);
					}
				}

				// ----------------------------------------
				//            Dashboard Resource
				// ----------------------------------------
				if (resource === 'dashboard') {
					if (operation === 'eventSegmentation') {
						const eventType = this.getNodeParameter('eventType', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const metric = this.getNodeParameter('metric', i) as string;
						const interval = this.getNodeParameter('interval', i) as string;
						const options = this.getNodeParameter('segmentationOptions', i) as IDataObject;

						const qs: IDataObject = {
							e: JSON.stringify(buildEventDefinition(eventType)),
							start: formatDateForAmplitude(startDate),
							end: formatDateForAmplitude(endDate),
							m: metric,
							i: interval,
						};

						if (options.groupBy) qs.g = options.groupBy;
						if (options.limit) qs.limit = options.limit;
						if (options.segments) {
							const segments = JSON.parse(options.segments as string);
							if (segments.length > 0) {
								qs.s = JSON.stringify(segments);
							}
						}

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/events/segmentation',
							{},
							qs,
						);
					}

					if (operation === 'funnelAnalysis') {
						const funnelEventsRaw = this.getNodeParameter('funnelEvents', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const options = this.getNodeParameter('funnelOptions', i) as IDataObject;

						const funnelEvents = JSON.parse(funnelEventsRaw);
						const eventDefs = funnelEvents.map((evt: string) => ({ event_type: evt }));

						const qs: IDataObject = {
							e: JSON.stringify(eventDefs),
							start: formatDateForAmplitude(startDate),
							end: formatDateForAmplitude(endDate),
						};

						if (options.conversionWindow) qs.n = options.conversionWindow;
						if (options.mode) qs.mode = options.mode;
						if (options.groupBy) qs.g = options.groupBy;
						if (options.segments) {
							const segments = JSON.parse(options.segments as string);
							if (segments.length > 0) {
								qs.s = JSON.stringify(segments);
							}
						}

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/funnels',
							{},
							qs,
						);
					}

					if (operation === 'retentionAnalysis') {
						const startingEvent = this.getNodeParameter('startingEvent', i) as string;
						const returningEvent = this.getNodeParameter('returningEvent', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const options = this.getNodeParameter('retentionOptions', i) as IDataObject;

						const qs: IDataObject = {
							se: JSON.stringify({ event_type: startingEvent }),
							re: JSON.stringify({ event_type: returningEvent }),
							start: formatDateForAmplitude(startDate),
							end: formatDateForAmplitude(endDate),
						};

						if (options.retentionMode) qs.rm = options.retentionMode;
						if (options.retentionBucket) qs.rb = options.retentionBucket;
						if (options.segments) {
							const segments = JSON.parse(options.segments as string);
							if (segments.length > 0) {
								qs.s = JSON.stringify(segments);
							}
						}

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/retention',
							{},
							qs,
						);
					}

					if (operation === 'userSessions') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const sessionMetric = this.getNodeParameter('sessionMetric', i) as string;
						const interval = this.getNodeParameter('interval', i) as string;

						const qs: IDataObject = {
							start: formatDateForAmplitude(startDate),
							end: formatDateForAmplitude(endDate),
							m: sessionMetric,
							i: interval,
						};

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/sessions/average',
							{},
							qs,
						);
					}

					if (operation === 'userComposition') {
						const eventType = this.getNodeParameter('eventType', i) as string;
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const propertyType = this.getNodeParameter('propertyType', i) as string;
						const propertyName = this.getNodeParameter('propertyName', i) as string;

						const qs: IDataObject = {
							e: JSON.stringify({ event_type: eventType }),
							start: formatDateForAmplitude(startDate),
							end: formatDateForAmplitude(endDate),
							p: propertyName,
							t: propertyType,
						};

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/composition',
							{},
							qs,
						);
					}

					if (operation === 'eventList') {
						const userId = this.getNodeParameter('userId', i) as string;
						const options = this.getNodeParameter('eventListOptions', i) as IDataObject;

						const qs: IDataObject = {
							user: userId,
						};

						if (options.limit) qs.limit = options.limit;
						if (options.offset) qs.offset = options.offset;

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/useractivity',
							{},
							qs,
						);
					}

					if (operation === 'exportChart') {
						const chartId = this.getNodeParameter('chartId', i) as string;

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							`/api/3/chart/${chartId}/query`,
							{},
							{},
						);
					}

					if (operation === 'getDataTables') {
						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/data-tables',
							{},
							{},
						);
					}
				}

				// ----------------------------------------
				//            Taxonomy Resource
				// ----------------------------------------
				if (resource === 'taxonomy') {
					if (operation === 'getEventTypes') {
						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'GET',
							'/api/2/taxonomy/event',
							{},
							{},
						);
					}

					if (operation === 'createEventType') {
						const eventTypeName = this.getNodeParameter('eventTypeName', i) as string;
						const fields = this.getNodeParameter('eventTypeFields', i) as IDataObject;

						const body: IDataObject = {
							event_type: eventTypeName,
						};

						if (fields.category) body.category = fields.category;
						if (fields.description) body.description = fields.description;
						if (fields.displayName) body.display_name = fields.displayName;
						if (fields.isBlocked !== undefined) body.is_blocked = fields.isBlocked;
						if (fields.isDeleted !== undefined) body.is_deleted = fields.isDeleted;
						if (fields.isVisible !== undefined) body.is_visible = fields.isVisible;

						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'POST',
							'/api/2/taxonomy/event',
							body,
							{},
						);
					}

					if (operation === 'updateEventType') {
						const eventTypeName = this.getNodeParameter('eventTypeName', i) as string;
						const fields = this.getNodeParameter('eventTypeFields', i) as IDataObject;

						const body: IDataObject = {};

						if (fields.category) body.category = fields.category;
						if (fields.description) body.description = fields.description;
						if (fields.displayName) body.display_name = fields.displayName;
						if (fields.isBlocked !== undefined) body.is_blocked = fields.isBlocked;
						if (fields.isDeleted !== undefined) body.is_deleted = fields.isDeleted;
						if (fields.isVisible !== undefined) body.is_visible = fields.isVisible;

						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'PUT',
							`/api/2/taxonomy/event/${encodeURIComponent(eventTypeName)}`,
							body,
							{},
						);
					}

					if (operation === 'deleteEventType') {
						const eventTypeName = this.getNodeParameter('eventTypeName', i) as string;

						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'DELETE',
							`/api/2/taxonomy/event/${encodeURIComponent(eventTypeName)}`,
							{},
							{},
						);
					}

					if (operation === 'getEventProperties') {
						const eventTypeName = this.getNodeParameter('eventTypeName', i) as string;

						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'GET',
							`/api/2/taxonomy/event/${encodeURIComponent(eventTypeName)}/properties`,
							{},
							{},
						);
					}

					if (operation === 'createEventProperty') {
						const eventTypeName = this.getNodeParameter('eventTypeName', i) as string;
						const propertyName = this.getNodeParameter('propertyName', i) as string;
						const fields = this.getNodeParameter('eventPropertyFields', i) as IDataObject;

						const body: IDataObject = {
							event_property: propertyName,
						};

						if (fields.propertyType) body.type = fields.propertyType;
						if (fields.description) body.description = fields.description;
						if (fields.isRequired !== undefined) body.is_required = fields.isRequired;
						if (fields.isBlocked !== undefined) body.is_blocked = fields.isBlocked;
						if (fields.isArrayType !== undefined) body.is_array_type = fields.isArrayType;
						if (fields.regex) body.regex = fields.regex;
						if (fields.enumValues) {
							body.enum_values = (fields.enumValues as string).split(',').map((v) => v.trim());
						}

						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'POST',
							`/api/2/taxonomy/event/${encodeURIComponent(eventTypeName)}/properties`,
							body,
							{},
						);
					}

					if (operation === 'getUserProperties') {
						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'GET',
							'/api/2/taxonomy/user-property',
							{},
							{},
						);
					}

					if (operation === 'createUserProperty') {
						const userPropertyName = this.getNodeParameter('userPropertyName', i) as string;
						const fields = this.getNodeParameter('userPropertyFields', i) as IDataObject;

						const body: IDataObject = {
							user_property: userPropertyName,
						};

						if (fields.propertyType) body.type = fields.propertyType;
						if (fields.description) body.description = fields.description;
						if (fields.isBlocked !== undefined) body.is_blocked = fields.isBlocked;
						if (fields.isArrayType !== undefined) body.is_array_type = fields.isArrayType;
						if (fields.regex) body.regex = fields.regex;
						if (fields.enumValues) {
							body.enum_values = (fields.enumValues as string).split(',').map((v) => v.trim());
						}

						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'POST',
							'/api/2/taxonomy/user-property',
							body,
							{},
						);
					}

					if (operation === 'getGroupProperties') {
						const groupType = this.getNodeParameter('groupType', i) as string;

						responseData = await amplitudeTaxonomyApiRequest.call(
							this,
							'GET',
							`/api/2/taxonomy/group-type/${encodeURIComponent(groupType)}/group-property`,
							{},
							{},
						);
					}
				}

				// ----------------------------------------
				//             Cohort Resource
				// ----------------------------------------
				if (resource === 'cohort') {
					if (operation === 'create') {
						const cohortName = this.getNodeParameter('cohortName', i) as string;
						const definitionRaw = this.getNodeParameter('definition', i) as string;
						const fields = this.getNodeParameter('createFields', i) as IDataObject;

						const definition = JSON.parse(definitionRaw);

						const body: IDataObject = {
							name: cohortName,
							definition,
						};

						if (fields.description) body.description = fields.description;
						if (fields.syncId) body.sync_id = fields.syncId;

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'POST',
							'/api/3/cohorts',
							body,
							{},
						);
					}

					if (operation === 'get') {
						const cohortId = this.getNodeParameter('cohortId', i) as string;

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							`/api/3/cohorts/${cohortId}`,
							{},
							{},
						);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/3/cohorts',
							{},
							{},
						);

						if (!returnAll && Array.isArray(responseData)) {
							responseData = (responseData as IDataObject[]).slice(0, limit);
						}
					}

					if (operation === 'update') {
						const cohortId = this.getNodeParameter('cohortId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.description) body.description = updateFields.description;
						if (updateFields.syncId) body.sync_id = updateFields.syncId;
						if (updateFields.definition) {
							body.definition = JSON.parse(updateFields.definition as string);
						}

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'PATCH',
							`/api/3/cohorts/${cohortId}`,
							body,
							{},
						);
					}

					if (operation === 'delete') {
						const cohortId = this.getNodeParameter('cohortId', i) as string;

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'DELETE',
							`/api/3/cohorts/${cohortId}`,
							{},
							{},
						);
					}

					if (operation === 'download') {
						const cohortId = this.getNodeParameter('cohortId', i) as string;
						const options = this.getNodeParameter('downloadOptions', i) as IDataObject;

						const qs: IDataObject = {};

						if (options.format) qs.format = options.format;
						if (options.includeProperties && options.properties) {
							qs.props = options.properties;
						}

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							`/api/5/cohorts/request/${cohortId}`,
							{},
							qs,
						);
					}
				}

				// ----------------------------------------
				//              User Resource
				// ----------------------------------------
				if (resource === 'user') {
					if (operation === 'search') {
						const searchBy = this.getNodeParameter('searchBy', i) as string;

						let qs: IDataObject = {};

						if (searchBy === 'userId') {
							const userId = this.getNodeParameter('userId', i) as string;
							qs = { user: userId };
						} else {
							const amplitudeId = this.getNodeParameter('amplitudeId', i) as string;
							qs = { amplitude_id: amplitudeId };
						}

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/usersearch',
							{},
							qs,
						);
					}

					if (operation === 'getActivity') {
						const userIdentifier = this.getNodeParameter('userIdentifier', i) as string;
						const options = this.getNodeParameter('activityOptions', i) as IDataObject;

						const qs: IDataObject = {
							user: userIdentifier,
						};

						if (options.limit) qs.limit = options.limit;
						if (options.offset) qs.offset = options.offset;
						if (options.startTime) qs.start = new Date(options.startTime as string).getTime();
						if (options.endTime) qs.end = new Date(options.endTime as string).getTime();

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/useractivity',
							{},
							qs,
						);
					}

					if (operation === 'getUserProperties') {
						const userIdentifier = this.getNodeParameter('userIdentifier', i) as string;

						const qs: IDataObject = {
							user: userIdentifier,
						};

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/usersearch',
							{},
							qs,
						);
					}

					if (operation === 'updateUserProperties') {
						const userIdentifier = this.getNodeParameter('userIdentifierUpdate', i) as string;
						const userPropertiesRaw = this.getNodeParameter('userProperties', i) as string;
						const options = this.getNodeParameter('updateOptions', i) as IDataObject;

						const userProperties = JSON.parse(userPropertiesRaw);

						const userPropsOperation: IDataObject = {
							$set: userProperties,
						};

						if (options.setOnceProperties) {
							const setOnce = JSON.parse(options.setOnceProperties as string);
							if (Object.keys(setOnce).length > 0) {
								userPropsOperation.$setOnce = setOnce;
							}
						}

						if (options.appendProperties) {
							const append = JSON.parse(options.appendProperties as string);
							if (Object.keys(append).length > 0) {
								userPropsOperation.$append = append;
							}
						}

						if (options.prependProperties) {
							const prepend = JSON.parse(options.prependProperties as string);
							if (Object.keys(prepend).length > 0) {
								userPropsOperation.$prepend = prepend;
							}
						}

						if (options.unsetProperties) {
							const unsetProps = (options.unsetProperties as string).split(',').map((p) => p.trim());
							userPropsOperation.$unset = unsetProps;
						}

						const body = {
							api_key: credentials.apiKey,
							identification: [
								{
									user_id: userIdentifier,
									user_properties: userPropsOperation,
								},
							],
						};

						responseData = await amplitudeHttpApiRequest.call(this, 'POST', '/identify', body);
					}
				}

				// ----------------------------------------
				//             Export Resource
				// ----------------------------------------
				if (resource === 'export') {
					if (operation === 'exportEvents') {
						const startDateTime = this.getNodeParameter('startDateTime', i) as string;
						const endDateTime = this.getNodeParameter('endDateTime', i) as string;

						const qs: IDataObject = {
							start: formatDateTimeForAmplitude(startDateTime),
							end: formatDateTimeForAmplitude(endDateTime),
						};

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/export',
							{},
							qs,
						);
					}

					if (operation === 'exportUserData') {
						const userId = this.getNodeParameter('userId', i) as string;
						const options = this.getNodeParameter('exportUserOptions', i) as IDataObject;

						const qs: IDataObject = {
							user_ids: userId,
						};

						if (options.startDate) {
							qs.start_date = formatDateForAmplitude(options.startDate as string);
						}
						if (options.endDate) {
							qs.end_date = formatDateForAmplitude(options.endDate as string);
						}
						if (options.includeEvents !== undefined) {
							qs.include_events = options.includeEvents;
						}
						if (options.includeUserProperties !== undefined) {
							qs.include_user_properties = options.includeUserProperties;
						}

						responseData = await amplitudeDashboardApiRequest.call(
							this,
							'GET',
							'/api/2/deletions/users',
							{},
							qs,
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
