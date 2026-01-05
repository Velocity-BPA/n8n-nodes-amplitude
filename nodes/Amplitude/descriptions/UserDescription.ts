/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				description: 'Search for users by user ID or Amplitude ID',
				action: 'Search users',
			},
			{
				name: 'Get Activity',
				value: 'getActivity',
				description: 'Get user activity stream',
				action: 'Get user activity',
			},
			{
				name: 'Get User Properties',
				value: 'getUserProperties',
				description: 'Get properties for a user',
				action: 'Get user properties',
			},
			{
				name: 'Update User Properties',
				value: 'updateUserProperties',
				description: 'Update properties for a user',
				action: 'Update user properties',
			},
		],
		default: 'search',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         user:search
	// ----------------------------------
	{
		displayName: 'Search By',
		name: 'searchBy',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['search'],
			},
		},
		options: [
			{
				name: 'User ID',
				value: 'userId',
				description: 'Search by user ID',
			},
			{
				name: 'Amplitude ID',
				value: 'amplitudeId',
				description: 'Search by Amplitude ID',
			},
		],
		default: 'userId',
		description: 'The field to search by',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['search', 'getActivity', 'getUserProperties', 'updateUserProperties'],
				searchBy: ['userId'],
			},
			hide: {
				searchBy: ['amplitudeId'],
			},
		},
		default: '',
		description: 'The user ID to search for',
	},
	{
		displayName: 'Amplitude ID',
		name: 'amplitudeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['search', 'getActivity', 'getUserProperties', 'updateUserProperties'],
				searchBy: ['amplitudeId'],
			},
		},
		default: '',
		description: 'The Amplitude ID to search for',
	},

	// ----------------------------------
	//         user:getActivity
	// ----------------------------------
	{
		displayName: 'User Identifier',
		name: 'userIdentifier',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getActivity', 'getUserProperties'],
			},
		},
		default: '',
		description: 'The user ID or Amplitude ID',
	},
	{
		displayName: 'Additional Options',
		name: 'activityOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getActivity'],
			},
		},
		options: [
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'dateTime',
				default: '',
				description: 'End of the time range to query',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1000,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'Number of events to skip',
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
				description: 'Start of the time range to query',
			},
		],
	},

	// ----------------------------------
	//         user:updateUserProperties
	// ----------------------------------
	{
		displayName: 'User Identifier',
		name: 'userIdentifierUpdate',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateUserProperties'],
			},
		},
		default: '',
		description: 'The user ID to update properties for',
	},
	{
		displayName: 'User Properties',
		name: 'userProperties',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateUserProperties'],
			},
		},
		default: '{}',
		description: 'The user properties to set (JSON object)',
	},
	{
		displayName: 'Update Fields',
		name: 'updateOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateUserProperties'],
			},
		},
		options: [
			{
				displayName: 'Append Properties',
				name: 'appendProperties',
				type: 'json',
				default: '{}',
				description: 'Properties to append to array values',
			},
			{
				displayName: 'Prepend Properties',
				name: 'prependProperties',
				type: 'json',
				default: '{}',
				description: 'Properties to prepend to array values',
			},
			{
				displayName: 'Set Once Properties',
				name: 'setOnceProperties',
				type: 'json',
				default: '{}',
				description: 'Properties to set only if not already set',
			},
			{
				displayName: 'Unset Properties',
				name: 'unsetProperties',
				type: 'string',
				default: '',
				description: 'Comma-separated list of properties to unset',
			},
		],
	},
];
