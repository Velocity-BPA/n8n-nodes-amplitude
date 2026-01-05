/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const exportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['export'],
			},
		},
		options: [
			{
				name: 'Export Events',
				value: 'exportEvents',
				description: 'Export raw event data',
				action: 'Export events',
			},
			{
				name: 'Export User Data',
				value: 'exportUserData',
				description: 'Export user data for GDPR/CCPA compliance',
				action: 'Export user data',
			},
		],
		default: 'exportEvents',
	},
];

export const exportFields: INodeProperties[] = [
	// ----------------------------------
	//         export:exportEvents
	// ----------------------------------
	{
		displayName: 'Start Date/Time',
		name: 'startDateTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportEvents'],
			},
		},
		default: '',
		description: 'Start of the export time range (format: YYYYMMDDTHH)',
	},
	{
		displayName: 'End Date/Time',
		name: 'endDateTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportEvents'],
			},
		},
		default: '',
		description: 'End of the export time range (format: YYYYMMDDTHH)',
	},

	// ----------------------------------
	//         export:exportUserData
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportUserData'],
			},
		},
		default: '',
		description: 'The user ID to export data for',
	},
	{
		displayName: 'Export Options',
		name: 'exportUserOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['export'],
				operation: ['exportUserData'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for the export range',
			},
			{
				displayName: 'Include Events',
				name: 'includeEvents',
				type: 'boolean',
				default: true,
				description: 'Whether to include event data in the export',
			},
			{
				displayName: 'Include User Properties',
				name: 'includeUserProperties',
				type: 'boolean',
				default: true,
				description: 'Whether to include user properties in the export',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for the export range',
			},
		],
	},
];
