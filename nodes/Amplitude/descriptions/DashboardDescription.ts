/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const dashboardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
			},
		},
		options: [
			{
				name: 'Event Segmentation',
				value: 'eventSegmentation',
				description: 'Analyze event trends and metrics',
				action: 'Event segmentation analysis',
			},
			{
				name: 'Funnel Analysis',
				value: 'funnelAnalysis',
				description: 'Analyze conversion funnels',
				action: 'Funnel analysis',
			},
			{
				name: 'Retention Analysis',
				value: 'retentionAnalysis',
				description: 'Analyze user retention',
				action: 'Retention analysis',
			},
			{
				name: 'User Sessions',
				value: 'userSessions',
				description: 'Analyze user session data',
				action: 'User session analysis',
			},
			{
				name: 'User Composition',
				value: 'userComposition',
				description: 'Analyze user breakdown by properties',
				action: 'User composition analysis',
			},
			{
				name: 'Event List',
				value: 'eventList',
				description: 'List events for a specific user',
				action: 'List user events',
			},
			{
				name: 'Export Chart',
				value: 'exportChart',
				description: 'Export chart data from a saved chart',
				action: 'Export chart data',
			},
			{
				name: 'Get Data Tables',
				value: 'getDataTables',
				description: 'Get available data tables',
				action: 'Get data tables',
			},
		],
		default: 'eventSegmentation',
	},
];

export const dashboardFields: INodeProperties[] = [
	// ----------------------------------
	//         Common Date Fields
	// ----------------------------------
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: [
					'eventSegmentation',
					'funnelAnalysis',
					'retentionAnalysis',
					'userSessions',
					'userComposition',
				],
			},
		},
		default: '',
		description: 'The start date for the analysis (format: YYYY-MM-DD)',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: [
					'eventSegmentation',
					'funnelAnalysis',
					'retentionAnalysis',
					'userSessions',
					'userComposition',
				],
			},
		},
		default: '',
		description: 'The end date for the analysis (format: YYYY-MM-DD)',
	},

	// ----------------------------------
	//         dashboard:eventSegmentation
	// ----------------------------------
	{
		displayName: 'Event Type',
		name: 'eventType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['eventSegmentation', 'userComposition'],
			},
		},
		default: '',
		description: 'The event type to analyze',
	},
	{
		displayName: 'Metric',
		name: 'metric',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['eventSegmentation'],
			},
		},
		options: [
			{
				name: 'Uniques',
				value: 'uniques',
				description: 'Count unique users',
			},
			{
				name: 'Totals',
				value: 'totals',
				description: 'Total event count',
			},
			{
				name: 'Average',
				value: 'avg',
				description: 'Average per user',
			},
			{
				name: 'Property Sum',
				value: 'psum',
				description: 'Sum of a property value',
			},
			{
				name: 'Property Average',
				value: 'pavg',
				description: 'Average of a property value',
			},
			{
				name: 'Formula',
				value: 'formula',
				description: 'Custom formula',
			},
		],
		default: 'uniques',
		description: 'The metric to calculate',
	},
	{
		displayName: 'Interval',
		name: 'interval',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['eventSegmentation', 'userSessions'],
			},
		},
		options: [
			{ name: 'Hourly', value: '-3600000' },
			{ name: 'Daily', value: '1' },
			{ name: 'Weekly', value: '7' },
			{ name: 'Monthly', value: '30' },
		],
		default: '1',
		description: 'The time interval for grouping data',
	},
	{
		displayName: 'Additional Options',
		name: 'segmentationOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['eventSegmentation'],
			},
		},
		options: [
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'string',
				default: '',
				description: 'Property to group results by',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 100,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Segments',
				name: 'segments',
				type: 'json',
				default: '[]',
				description: 'Segment definitions for filtering',
			},
		],
	},

	// ----------------------------------
	//         dashboard:funnelAnalysis
	// ----------------------------------
	{
		displayName: 'Funnel Events',
		name: 'funnelEvents',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['funnelAnalysis'],
			},
		},
		default: '["Event1", "Event2", "Event3"]',
		description: 'Array of event types defining the funnel steps',
	},
	{
		displayName: 'Additional Options',
		name: 'funnelOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['funnelAnalysis'],
			},
		},
		options: [
			{
				displayName: 'Conversion Window',
				name: 'conversionWindow',
				type: 'options',
				options: [
					{ name: '1 Day', value: '1' },
					{ name: '7 Days', value: '7' },
					{ name: '14 Days', value: '14' },
					{ name: '30 Days', value: '30' },
					{ name: '60 Days', value: '60' },
					{ name: '90 Days', value: '90' },
				],
				default: '30',
				description: 'Maximum time for conversion between steps',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'string',
				default: '',
				description: 'Property to group results by',
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Ordered', value: 'ordered' },
					{ name: 'Unordered', value: 'unordered' },
				],
				default: 'ordered',
				description: 'Whether funnel steps must be in order',
			},
			{
				displayName: 'Segments',
				name: 'segments',
				type: 'json',
				default: '[]',
				description: 'Segment definitions for filtering',
			},
		],
	},

	// ----------------------------------
	//         dashboard:retentionAnalysis
	// ----------------------------------
	{
		displayName: 'Starting Event',
		name: 'startingEvent',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['retentionAnalysis'],
			},
		},
		default: '',
		description: 'The event that starts the retention period',
	},
	{
		displayName: 'Returning Event',
		name: 'returningEvent',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['retentionAnalysis'],
			},
		},
		default: '',
		description: 'The event that indicates a return',
	},
	{
		displayName: 'Additional Options',
		name: 'retentionOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['retentionAnalysis'],
			},
		},
		options: [
			{
				displayName: 'Retention Mode',
				name: 'retentionMode',
				type: 'options',
				options: [
					{ name: 'N-Day', value: 'n-day' },
					{ name: 'Unbounded', value: 'unbounded' },
					{ name: 'Bracket', value: 'bracket' },
				],
				default: 'n-day',
				description: 'The retention calculation mode',
			},
			{
				displayName: 'Retention Bucket',
				name: 'retentionBucket',
				type: 'options',
				options: [
					{ name: 'Daily', value: '1' },
					{ name: 'Weekly', value: '7' },
					{ name: 'Monthly', value: '30' },
				],
				default: '1',
				description: 'The time bucket for retention periods',
			},
			{
				displayName: 'Segments',
				name: 'segments',
				type: 'json',
				default: '[]',
				description: 'Segment definitions for filtering',
			},
		],
	},

	// ----------------------------------
	//         dashboard:userSessions
	// ----------------------------------
	{
		displayName: 'Session Metric',
		name: 'sessionMetric',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['userSessions'],
			},
		},
		options: [
			{ name: 'Session Count', value: 'sessions' },
			{ name: 'Average Session Length', value: 'avgLength' },
			{ name: 'Average Events Per Session', value: 'avgEvents' },
		],
		default: 'sessions',
		description: 'The session metric to analyze',
	},

	// ----------------------------------
	//         dashboard:userComposition
	// ----------------------------------
	{
		displayName: 'Property Type',
		name: 'propertyType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['userComposition'],
			},
		},
		options: [
			{ name: 'User Property', value: 'user' },
			{ name: 'Event Property', value: 'event' },
		],
		default: 'user',
		description: 'The type of property to analyze',
	},
	{
		displayName: 'Property Name',
		name: 'propertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['userComposition'],
			},
		},
		default: '',
		description: 'The name of the property to analyze',
	},

	// ----------------------------------
	//         dashboard:eventList
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['eventList'],
			},
		},
		default: '',
		description: 'The user ID to get events for',
	},
	{
		displayName: 'Additional Options',
		name: 'eventListOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['eventList'],
			},
		},
		options: [
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
		],
	},

	// ----------------------------------
	//         dashboard:exportChart
	// ----------------------------------
	{
		displayName: 'Chart ID',
		name: 'chartId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dashboard'],
				operation: ['exportChart'],
			},
		},
		default: '',
		description: 'The ID of the saved chart to export',
	},
];
