/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	getBaseUrl,
	generateInsertId,
	buildEventObject,
	validateIdLength,
	formatDateForAmplitude,
	formatDateTimeForAmplitude,
	buildSegments,
	buildEventDefinition,
} from '../../nodes/Amplitude/GenericFunctions';

describe('GenericFunctions', () => {
	describe('getBaseUrl', () => {
		it('should return US HTTP API URL for US region', () => {
			expect(getBaseUrl('us', 'http')).toBe('https://api2.amplitude.com');
		});

		it('should return EU HTTP API URL for EU region', () => {
			expect(getBaseUrl('eu', 'http')).toBe('https://api.eu.amplitude.com');
		});

		it('should return US Dashboard API URL for US region', () => {
			expect(getBaseUrl('us', 'dashboard')).toBe('https://amplitude.com');
		});

		it('should return EU Dashboard API URL for EU region', () => {
			expect(getBaseUrl('eu', 'dashboard')).toBe('https://analytics.eu.amplitude.com');
		});

		it('should return US Taxonomy API URL for US region', () => {
			expect(getBaseUrl('us', 'taxonomy')).toBe('https://amplitude.com');
		});

		it('should return EU Taxonomy API URL for EU region', () => {
			expect(getBaseUrl('eu', 'taxonomy')).toBe('https://analytics.eu.amplitude.com');
		});
	});

	describe('generateInsertId', () => {
		it('should generate a unique insert ID', () => {
			const userId = 'user123';
			const insertId = generateInsertId(userId);

			expect(insertId).toContain(userId);
			expect(insertId.split('_').length).toBe(3);
		});

		it('should generate different IDs for consecutive calls', () => {
			const userId = 'user123';
			const insertId1 = generateInsertId(userId);
			const insertId2 = generateInsertId(userId);

			expect(insertId1).not.toBe(insertId2);
		});
	});

	describe('buildEventObject', () => {
		it('should build event with user_id', () => {
			const event = buildEventObject('click', 'user12345', undefined, {}, {}, {});

			expect(event.event_type).toBe('click');
			expect(event.user_id).toBe('user12345');
			expect(event.insert_id).toBeDefined();
			expect(event.time).toBeDefined();
		});

		it('should build event with device_id', () => {
			const event = buildEventObject('click', undefined, 'device12345', {}, {}, {});

			expect(event.event_type).toBe('click');
			expect(event.device_id).toBe('device12345');
			expect(event.insert_id).toBeDefined();
		});

		it('should include event properties', () => {
			const eventProps = { button: 'signup', page: 'home' };
			const event = buildEventObject('click', 'user12345', undefined, eventProps, {}, {});

			expect(event.event_properties).toEqual(eventProps);
		});

		it('should include user properties', () => {
			const userProps = { plan: 'premium', company: 'Acme' };
			const event = buildEventObject('click', 'user12345', undefined, {}, userProps, {});

			expect(event.user_properties).toEqual(userProps);
		});

		it('should include additional fields', () => {
			const additionalFields = {
				platform: 'Web',
				osName: 'Windows',
				country: 'US',
			};
			const event = buildEventObject('click', 'user12345', undefined, {}, {}, additionalFields);

			expect(event.platform).toBe('Web');
			expect(event.os_name).toBe('Windows');
			expect(event.country).toBe('US');
		});

		it('should throw error if neither user_id nor device_id provided', () => {
			expect(() => {
				buildEventObject('click', undefined, undefined, {}, {}, {});
			}).toThrow('Either user_id or device_id must be provided');
		});
	});

	describe('validateIdLength', () => {
		it('should not throw for valid ID length', () => {
			expect(() => validateIdLength('user12345', 'user_id')).not.toThrow();
		});

		it('should throw for ID shorter than 5 characters', () => {
			expect(() => validateIdLength('usr', 'user_id')).toThrow(
				'user_id must be at least 5 characters long',
			);
		});

		it('should not throw for empty string (optional field)', () => {
			expect(() => validateIdLength('', 'user_id')).not.toThrow();
		});
	});

	describe('formatDateForAmplitude', () => {
		it('should format date correctly', () => {
			const result = formatDateForAmplitude('2024-03-15');
			expect(result).toBe('20240315');
		});

		it('should handle different date formats', () => {
			const result = formatDateForAmplitude('2024-01-01T12:00:00Z');
			expect(result).toBe('20240101');
		});
	});

	describe('formatDateTimeForAmplitude', () => {
		it('should format datetime correctly', () => {
			const result = formatDateTimeForAmplitude('2024-03-15T14:00:00Z');
			expect(result).toBe('20240315T14');
		});
	});

	describe('buildSegments', () => {
		it('should build segments array correctly', () => {
			const segmentDefs = [
				{ property: 'country', operator: 'is', values: 'US,UK' },
			];
			const result = buildSegments(segmentDefs);

			expect(result).toHaveLength(1);
			expect(result[0].prop).toBe('country');
			expect(result[0].op).toBe('is');
			expect(result[0].values).toEqual(['US', 'UK']);
		});

		it('should handle array values', () => {
			const segmentDefs = [
				{ property: 'country', operator: 'is', values: ['US', 'UK'] },
			];
			const result = buildSegments(segmentDefs);

			expect(result[0].values).toEqual(['US', 'UK']);
		});
	});

	describe('buildEventDefinition', () => {
		it('should build basic event definition', () => {
			const result = buildEventDefinition('Click');

			expect(result.event_type).toBe('Click');
		});

		it('should include group_by', () => {
			const result = buildEventDefinition('Click', ['country', 'platform']);

			expect(result.group_by).toHaveLength(2);
			expect(result.group_by[0].type).toBe('event');
			expect(result.group_by[0].value).toBe('country');
		});

		it('should include filters', () => {
			const filters = [
				{ propertyType: 'event', property: 'country', operator: 'is', values: 'US' },
			];
			const result = buildEventDefinition('Click', undefined, filters);

			expect(result.filters).toHaveLength(1);
			expect(result.filters[0].subprop_key).toBe('country');
		});
	});
});
