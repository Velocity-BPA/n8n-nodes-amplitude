/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const cohortOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cohort'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new cohort',
				action: 'Create a cohort',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a cohort',
				action: 'Delete a cohort',
			},
			{
				name: 'Download',
				value: 'download',
				description: 'Download cohort members',
				action: 'Download cohort members',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a cohort by ID',
				action: 'Get a cohort',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all cohorts',
				action: 'Get all cohorts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a cohort',
				action: 'Update a cohort',
			},
		],
		default: 'getAll',
	},
];

export const cohortFields: INodeProperties[] = [
	// ----------------------------------
	//         cohort:create
	// ----------------------------------
	{
		displayName: 'Cohort Name',
		name: 'cohortName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the cohort',
	},
	{
		displayName: 'Definition',
		name: 'definition',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['create'],
			},
		},
		default: '{}',
		description: 'The cohort definition (JSON object with behavioral or property conditions)',
	},
	{
		displayName: 'Additional Fields',
		name: 'createFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the cohort',
			},
			{
				displayName: 'Sync ID',
				name: 'syncId',
				type: 'string',
				default: '',
				description: 'A sync identifier for the cohort',
			},
		],
	},

	// ----------------------------------
	//         cohort:get
	// ----------------------------------
	{
		displayName: 'Cohort ID',
		name: 'cohortId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['get', 'update', 'delete', 'download'],
			},
		},
		default: '',
		description: 'The ID of the cohort',
	},

	// ----------------------------------
	//         cohort:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         cohort:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Definition',
				name: 'definition',
				type: 'json',
				default: '{}',
				description: 'The updated cohort definition',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The updated description',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The updated cohort name',
			},
			{
				displayName: 'Sync ID',
				name: 'syncId',
				type: 'string',
				default: '',
				description: 'The updated sync identifier',
			},
		],
	},

	// ----------------------------------
	//         cohort:download
	// ----------------------------------
	{
		displayName: 'Download Options',
		name: 'downloadOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['cohort'],
				operation: ['download'],
			},
		},
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'CSV', value: 'csv' },
				],
				default: 'json',
				description: 'The format for the downloaded data',
			},
			{
				displayName: 'Include Properties',
				name: 'includeProperties',
				type: 'boolean',
				default: false,
				description: 'Whether to include user properties in the download',
			},
			{
				displayName: 'Properties',
				name: 'properties',
				type: 'string',
				default: '',
				description: 'Comma-separated list of user properties to include',
				displayOptions: {
					show: {
						includeProperties: [true],
					},
				},
			},
		],
	},
];
