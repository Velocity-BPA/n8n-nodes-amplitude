/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AmplitudeApi implements ICredentialType {
	name = 'amplitudeApi';
	displayName = 'Amplitude API';
	documentationUrl = 'https://www.docs.developers.amplitude.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Amplitude API Key. Found in Amplitude under Settings > Projects > Your Project.',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Amplitude Secret Key. Required for Dashboard API access.',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'US',
					value: 'us',
					description: 'United States data center',
				},
				{
					name: 'EU',
					value: 'eu',
					description: 'European Union data center',
				},
			],
			default: 'us',
			description: 'The Amplitude data center region for your project',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.region === "eu" ? "https://api.eu.amplitude.com" : "https://api2.amplitude.com"}}',
			url: '/2/httpapi',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				api_key: '={{$credentials.apiKey}}',
				events: [
					{
						user_id: 'n8n_credential_test',
						event_type: 'n8n_credential_test',
						time: Date.now(),
					},
				],
			}),
		},
	};
}
