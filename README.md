# n8n-nodes-amplitude

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Amplitude, the leading product analytics platform. This node enables workflow automation for event tracking, user analytics, cohort management, taxonomy management, and data export.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- **Event Tracking**: Send single events, batch events, identify users, group identify, and track revenue
- **Dashboard Queries**: Event segmentation, funnel analysis, retention analysis, user sessions, user composition
- **Taxonomy Management**: Manage event types, event properties, user properties, and group properties
- **Cohort Management**: Create, read, update, delete, and download cohort members
- **User Management**: Search users, get activity streams, manage user properties
- **Data Export**: Export raw events and user data for GDPR/CCPA compliance
- **Multi-Region Support**: US and EU data center support
- **Rate Limit Handling**: Automatic retry with exponential backoff

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-amplitude`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-amplitude

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-amplitude.git
cd n8n-nodes-amplitude

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-amplitude

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Amplitude API Key | Yes |
| Secret Key | Your Amplitude Secret Key | Yes |
| Region | Data center region (US or EU) | Yes |

### Finding Your Credentials

1. Log in to Amplitude
2. Go to **Settings** → **Projects**
3. Select your project
4. Copy the **API Key** and **Secret Key**

## Resources & Operations

### Event Resource

| Operation | Description |
|-----------|-------------|
| Send | Send a single event to Amplitude |
| Send Batch | Send multiple events in a batch (up to 10 recommended) |
| Identify | Set user properties |
| Group Identify | Set group properties |
| Revenue | Track a revenue event |

### Dashboard Resource

| Operation | Description |
|-----------|-------------|
| Event Segmentation | Analyze event trends and metrics |
| Funnel Analysis | Analyze conversion funnels |
| Retention Analysis | Analyze user retention |
| User Sessions | Analyze user session data |
| User Composition | Analyze user breakdown by properties |
| Event List | List events for a specific user |
| Export Chart | Export chart data from a saved chart |
| Get Data Tables | Get available data tables |

### Taxonomy Resource

| Operation | Description |
|-----------|-------------|
| Get Event Types | List all event types |
| Create Event Type | Create a new event type |
| Update Event Type | Update an existing event type |
| Delete Event Type | Delete an event type |
| Get Event Properties | List properties for an event type |
| Create Event Property | Create a new event property |
| Get User Properties | List all user properties |
| Create User Property | Create a new user property |
| Get Group Properties | List properties for a group type |

### Cohort Resource

| Operation | Description |
|-----------|-------------|
| Create | Create a new cohort |
| Get | Get a cohort by ID |
| Get Many | Get all cohorts |
| Update | Update a cohort |
| Delete | Delete a cohort |
| Download | Download cohort members |

### User Resource

| Operation | Description |
|-----------|-------------|
| Search | Search for users by user ID or Amplitude ID |
| Get Activity | Get user activity stream |
| Get User Properties | Get properties for a user |
| Update User Properties | Update properties for a user |

### Export Resource

| Operation | Description |
|-----------|-------------|
| Export Events | Export raw event data |
| Export User Data | Export user data for GDPR/CCPA compliance |

## Usage Examples

### Send an Event

```javascript
// Event parameters
{
  "eventType": "Button Clicked",
  "userId": "user_12345",
  "eventProperties": {
    "button_name": "signup",
    "page": "homepage"
  }
}
```

### Identify a User

```javascript
// Identify parameters
{
  "userId": "user_12345",
  "userProperties": {
    "plan": "premium",
    "company": "Acme Inc"
  }
}
```

### Run Event Segmentation

```javascript
// Event segmentation parameters
{
  "eventType": "Purchase Completed",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "metric": "uniques",
  "interval": "1"
}
```

### Create a Cohort

```javascript
// Cohort creation parameters
{
  "cohortName": "Power Users",
  "definition": {
    "operator": "AND",
    "conditions": [
      {
        "event_type": "Login",
        "count_operator": ">=",
        "count_value": 10
      }
    ]
  }
}
```

## Amplitude Concepts

### Events
Events are user actions tracked in Amplitude. Each event has a type, user identifier, and optional properties.

### User Properties
User properties are attributes associated with a user that persist across events (e.g., plan type, company name).

### Cohorts
Cohorts are groups of users defined by behavioral or property conditions.

### Taxonomy
The taxonomy defines the schema for your events and properties, helping maintain data quality.

## Rate Limits

| API | Limit |
|-----|-------|
| HTTP V2 (Events) | 100 batches/sec, 1000 events/sec (Starter) |
| Dashboard | 5 concurrent requests, 108K cost/hour |
| User Property Updates | 1800/hour per user |

This node automatically handles rate limits with exponential backoff.

## Error Handling

The node includes comprehensive error handling:

- **Rate Limiting**: Automatic retry with exponential backoff
- **Server Errors**: Automatic retry up to 3 times
- **Validation Errors**: Clear error messages for invalid parameters
- **Continue on Fail**: Option to continue workflow on errors

## Security Best Practices

1. **Store credentials securely**: Use n8n's credential management
2. **Use appropriate scopes**: Only request necessary permissions
3. **Monitor API usage**: Keep track of API calls to avoid rate limits
4. **Validate user input**: Ensure user/device IDs meet minimum length requirements (5 characters)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass
- Code follows the existing style
- Documentation is updated

## Support

- **Documentation**: [Amplitude API Docs](https://www.docs.developers.amplitude.com/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-amplitude/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Amplitude](https://amplitude.com/) for their comprehensive analytics platform and API
- [n8n](https://n8n.io/) for the excellent workflow automation platform
- The n8n community for inspiration and best practices
