# Jira Service Management Integration for Onyx

This directory contains the integration for Jira Service Management within the Onyx platform.
It allows Onyx to interact with Jira Service Management to:

- Create service requests.
- Fetch request types from a service desk.
- (Future) Monitor and update service requests.

## Getting Started

### Installation

Navigate to this directory and install dependencies using Bun:

```bash
bun install
```

### Configuration

This integration requires the following environment variables to be set:

- `JIRA_BASE_URL`: The base URL of your Jira instance (e.g., `https://your-domain.atlassian.net`)
- `JIRA_API_TOKEN`: A Jira API token for authentication.
- `JIRA_USER_EMAIL`: The email address associated with the API token.

### Usage

Example usage for creating a service request:

```typescript
import { JiraServiceManagementClient } from '@onyx/jira-service-management';

const client = new JiraServiceManagementClient(
    process.env.JIRA_BASE_URL!,
    process.env.JIRA_USER_EMAIL!,
    process.env.JIRA_API_TOKEN!
);

async function createIssue() {
    const payload = {
        serviceDeskId: "1",
        requestTypeId: "10001",
        requestFieldValues: {
            summary: "Need help with my laptop",
            description: "My laptop is making strange noises and won't turn on."
        }
    };
    const response = await client.createServiceRequest(payload);
    console.log("Service Request Created:", response);
}

createIssue();
```

## Development

To run tests or develop this integration, use the following commands:

```bash
bun test
bun dev
```

*(Note: `bun test` and `bun dev` are placeholders and assume these scripts will be added to `package.json` later.)*
