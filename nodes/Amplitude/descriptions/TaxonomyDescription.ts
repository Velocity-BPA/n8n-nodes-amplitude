/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const taxonomyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['taxonomy'],
			},
		},
		options: [
			{
				name: 'Get Event Types',
				value: 'getEventTypes',
				description: 'List all event types in the taxonomy',
				action: 'Get event types',
			},
			{
				name: 'Create Event Type',
				value: 'createEventType',
				description: 'Create a new event type',
				action: 'Create event type',
			},
			{
				name: 'Update Event Type',
				value: 'updateEventType',
				description: 'Update an existing event type',
				action: 'Update event type',
			},
			{
				name: 'Delete Event Type',
				value: 'deleteEventType',
				description: 'Delete an event type',
				action: 'Delete event type',
			},
			{
				name: 'Get Event Properties',
				value: 'getEventProperties',
				description: 'List properties for an event type',
				action: 'Get event properties',
			},
			{
				name: 'Create Event Property',
				value: 'createEventProperty',
				description: 'Create a new event property',
				action: 'Create event property',
			},
			{
				name: 'Get User Properties',
				value: 'getUserProperties',
				description: 'List all user properties',
				action: 'Get user properties',
			},
			{
				name: 'Create User Property',
				value: 'createUserProperty',
				description: 'Create a new user property',
				action: 'Create user property',
			},
			{
				name: 'Get Group Properties',
				value: 'getGroupProperties',
				description: 'List properties for a group type',
				action: 'Get group properties',
			},
		],
		default: 'getEventTypes',
	},
];

export const taxonomyFields: INodeProperties[] = [
	// ----------------------------------
	//         taxonomy:createEventType
	// ----------------------------------
	{
		displayName: 'Event Type Name',
		name: 'eventTypeName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taxonomy'],
				operation: ['createEventType', 'updateEventType', 'deleteEventType', 'getEventProperties', 'createEventProperty'],
			},
		},
		default: '',
		description: 'The name of the event type',
	},
	{
		displayName: 'Additional Fields',
		name: 'eventTypeFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['taxonomy'],
				operation: ['createEventType', 'updateEventType'],
			},
		},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'The category for the event type',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the event type',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				description: 'The display name for the event type in the UI',
			},
			{
				displayName: 'Is Blocked',
				name: 'isBlocked',
				type: 'boolean',
				default: false,
				description: 'Whether the event type is blocked from ingestion',
			},
			{
				displayName: 'Is Deleted',
				name: 'isDeleted',
				type: 'boolean',
				default: false,
				description: 'Whether the event type is marked as deleted',
			},
			{
				displayName: 'Is Visible',
				name: 'isVisible',
				type: 'boolean',
				default: true,
				description: 'Whether the event type is visible in the UI',
			},
		],
	},

	// ----------------------------------
	//         taxonomy:createEventProperty
	// ----------------------------------
	{
		displayName: 'Property Name',
		name: 'propertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taxonomy'],
				operation: ['createEventProperty'],
			},
		},
		default: '',
		description: 'The name of the event property',
	},
	{
		displayName: 'Additional Fields',
		name: 'eventPropertyFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['taxonomy'],
				operation: ['createEventProperty'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the property',
			},
			{
				displayName: 'Enum Values',
				name: 'enumValues',
				type: 'string',
				default: '',
				description: 'Comma-separated list of allowed values for the property',
			},
			{
				displayName: 'Is Array Type',
				name: 'isArrayType',
				type: 'boolean',
				default: false,
				description: 'Whether the property value is an array',
			},
			{
				displayName: 'Is Blocked',
				name: 'isBlocked',
				type: 'boolean',
				default: false,
				description: 'Whether the property is blocked from ingestion',
			},
			{
				displayName: 'Is Required',
				name: 'isRequired',
				type: 'boolean',
				default: false,
				description: 'Whether the property is required',
			},
			{
				displayName: 'Property Type',
				name: 'propertyType',
				type: 'options',
				options: [
					{ name: 'String', value: 'string' },
					{ name: 'Number', value: 'number' },
					{ name: 'Boolean', value: 'boolean' },
					{ name: 'Enum', value: 'enum' },
					{ name: 'Any', value: 'any' },
				],
				default: 'string',
				description: 'The data type of the property',
			},
			{
				displayName: 'Regex',
				name: 'regex',
				type: 'string',
				default: '',
				description: 'A regex pattern for validating property values',
			},
		],
	},

	// ----------------------------------
	//         taxonomy:createUserProperty
	// ----------------------------------
	{
		displayName: 'User Property Name',
		name: 'userPropertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taxonomy'],
				operation: ['createUserProperty'],
			},
		},
		default: '',
		description: 'The name of the user property',
	},
	{
		displayName: 'Additional Fields',
		name: 'userPropertyFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['taxonomy'],
				operation: ['createUserProperty'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the user property',
			},
			{
				displayName: 'Enum Values',
				name: 'enumValues',
				type: 'string',
				default: '',
				description: 'Comma-separated list of allowed values',
			},
			{
				displayName: 'Is Array Type',
				name: 'isArrayType',
				type: 'boolean',
				default: false,
				description: 'Whether the property value is an array',
			},
			{
				displayName: 'Is Blocked',
				name: 'isBlocked',
				type: 'boolean',
				default: false,
				description: 'Whether the property is blocked',
			},
			{
				displayName: 'Property Type',
				name: 'propertyType',
				type: 'options',
				options: [
					{ name: 'String', value: 'string' },
					{ name: 'Number', value: 'number' },
					{ name: 'Boolean', value: 'boolean' },
					{ name: 'Enum', value: 'enum' },
					{ name: 'Any', value: 'any' },
				],
				default: 'string',
				description: 'The data type of the property',
			},
			{
				displayName: 'Regex',
				name: 'regex',
				type: 'string',
				default: '',
				description: 'A regex pattern for validation',
			},
		],
	},

	// ----------------------------------
	//         taxonomy:getGroupProperties
	// ----------------------------------
	{
		displayName: 'Group Type',
		name: 'groupType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['taxonomy'],
				operation: ['getGroupProperties'],
			},
		},
		default: '',
		description: 'The group type to get properties for',
	},
];
