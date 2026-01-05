/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Send a single event',
				action: 'Send an event',
			},
			{
				name: 'Send Batch',
				value: 'sendBatch',
				description: 'Send multiple events in a batch (up to 10 recommended)',
				action: 'Send batch of events',
			},
			{
				name: 'Identify',
				value: 'identify',
				description: 'Set user properties',
				action: 'Identify a user',
			},
			{
				name: 'Group Identify',
				value: 'groupIdentify',
				description: 'Set group properties',
				action: 'Identify a group',
			},
			{
				name: 'Revenue',
				value: 'revenue',
				description: 'Track a revenue event',
				action: 'Track revenue',
			},
		],
		default: 'send',
	},
];

export const eventFields: INodeProperties[] = [
	// ----------------------------------
	//         event:send
	// ----------------------------------
	{
		displayName: 'Event Type',
		name: 'eventType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send'],
			},
		},
		default: '',
		description: 'The name of the event (e.g., "Button Clicked", "Purchase Completed")',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send', 'identify', 'revenue'],
			},
		},
		default: '',
		description:
			'A readable ID specified by you (minimum 5 characters). Required if device_id is not provided.',
	},
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send', 'identify', 'revenue'],
			},
		},
		default: '',
		description:
			'A device-specific identifier (minimum 5 characters). Required if user_id is not provided.',
	},
	{
		displayName: 'Event Properties',
		name: 'eventProperties',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send', 'revenue'],
			},
		},
		default: '{}',
		description: 'Custom properties associated with the event (JSON object)',
	},
	{
		displayName: 'User Properties',
		name: 'userProperties',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send', 'identify'],
			},
		},
		default: '{}',
		description: 'Custom properties associated with the user (JSON object)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'App Version',
				name: 'appVersion',
				type: 'string',
				default: '',
				description: 'The version of the app',
			},
			{
				displayName: 'Carrier',
				name: 'carrier',
				type: 'string',
				default: '',
				description: 'The mobile carrier of the device',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: "The city where the user is located (derived from IP if not provided)",
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'The country where the user is located (ISO Alpha-2 code)',
			},
			{
				displayName: 'Device Brand',
				name: 'deviceBrand',
				type: 'string',
				default: '',
				description: 'The brand of the device (e.g., Apple, Samsung)',
			},
			{
				displayName: 'Device Manufacturer',
				name: 'deviceManufacturer',
				type: 'string',
				default: '',
				description: 'The manufacturer of the device',
			},
			{
				displayName: 'Device Model',
				name: 'deviceModel',
				type: 'string',
				default: '',
				description: 'The model of the device',
			},
			{
				displayName: 'DMA',
				name: 'dma',
				type: 'string',
				default: '',
				description: 'The designated market area (DMA) of the user',
			},
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'number',
				default: 0,
				description: 'An incrementing counter to distinguish events',
			},
			{
				displayName: 'IP Address',
				name: 'ip',
				type: 'string',
				default: '',
				description: 'The IP address of the user (used for geolocation)',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'The language of the user (ISO 639-1 code)',
			},
			{
				displayName: 'OS Name',
				name: 'osName',
				type: 'string',
				default: '',
				description: 'The operating system name (e.g., iOS, Android, Windows)',
			},
			{
				displayName: 'OS Version',
				name: 'osVersion',
				type: 'string',
				default: '',
				description: 'The version of the operating system',
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'Android', value: 'Android' },
					{ name: 'iOS', value: 'iOS' },
					{ name: 'Web', value: 'Web' },
				],
				default: 'Web',
				description: 'The platform of the device',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'The region/state where the user is located',
			},
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'number',
				default: 0,
				description: 'The session ID to group events into a session',
			},
			{
				displayName: 'Time',
				name: 'time',
				type: 'dateTime',
				default: '',
				description: 'The timestamp of the event (defaults to current time if not provided)',
			},
		],
	},

	// ----------------------------------
	//         event:sendBatch
	// ----------------------------------
	{
		displayName: 'Events',
		name: 'events',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['sendBatch'],
			},
		},
		default: '[]',
		description:
			'Array of event objects to send. Each event must have event_type and either user_id or device_id.',
	},

	// ----------------------------------
	//         event:identify
	// ----------------------------------
	{
		displayName: 'Groups',
		name: 'groups',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['identify'],
			},
		},
		default: '{}',
		description: 'Groups the user belongs to (JSON object with group_type: group_value pairs)',
	},
	{
		displayName: 'Additional Fields',
		name: 'identifyAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['identify'],
			},
		},
		options: [
			{
				displayName: 'App Version',
				name: 'appVersion',
				type: 'string',
				default: '',
				description: 'The version of the app',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'The city where the user is located',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'The country where the user is located',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'The language of the user',
			},
			{
				displayName: 'OS Name',
				name: 'osName',
				type: 'string',
				default: '',
				description: 'The operating system name',
			},
			{
				displayName: 'OS Version',
				name: 'osVersion',
				type: 'string',
				default: '',
				description: 'The version of the operating system',
			},
			{
				displayName: 'Paying',
				name: 'paying',
				type: 'options',
				options: [
					{ name: 'True', value: 'true' },
					{ name: 'False', value: 'false' },
				],
				default: 'false',
				description: 'Whether the user is a paying customer',
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'Android', value: 'Android' },
					{ name: 'iOS', value: 'iOS' },
					{ name: 'Web', value: 'Web' },
				],
				default: 'Web',
				description: 'The platform of the device',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'The region/state where the user is located',
			},
			{
				displayName: 'Start Version',
				name: 'startVersion',
				type: 'string',
				default: '',
				description: 'The app version when the user first used the app',
			},
		],
	},

	// ----------------------------------
	//         event:groupIdentify
	// ----------------------------------
	{
		displayName: 'Group Type',
		name: 'groupType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['groupIdentify'],
			},
		},
		default: '',
		description: 'The type/name of the group (e.g., "company", "team")',
	},
	{
		displayName: 'Group Value',
		name: 'groupValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['groupIdentify'],
			},
		},
		default: '',
		description: 'The identifier for the specific group (e.g., "Acme Inc.")',
	},
	{
		displayName: 'Group Properties',
		name: 'groupProperties',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['groupIdentify'],
			},
		},
		default: '{}',
		description: 'Custom properties to associate with the group (JSON object)',
	},

	// ----------------------------------
	//         event:revenue
	// ----------------------------------
	{
		displayName: 'Revenue',
		name: 'revenue',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['revenue'],
			},
		},
		default: 0,
		description: 'The revenue amount',
	},
	{
		displayName: 'Additional Revenue Fields',
		name: 'revenueAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['revenue'],
			},
		},
		options: [
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'string',
				default: 'revenue_amount',
				description: 'The event type for the revenue event',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				description: 'The price of the item',
			},
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'An identifier for the product',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'The quantity of items purchased',
			},
			{
				displayName: 'Revenue Type',
				name: 'revenueType',
				type: 'string',
				default: '',
				description: 'The type of revenue (e.g., "purchase", "subscription")',
			},
		],
	},
];
