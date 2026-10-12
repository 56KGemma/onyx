// src/test.ts

import { JiraServiceManagementClient } from './jiraServiceManagementClient';
import { JiraServiceRequestPayload, JiraServiceRequestResponse, JiraRequestType } from './types';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('JiraServiceManagementClient', () => {
    const baseUrl = "https://mock-jira.atlassian.net";
    const email = "test@example.com";
    const apiToken = "mock-api-token";

    let client: JiraServiceManagementClient;

    beforeEach(() => {
        client = new JiraServiceManagementClient(baseUrl, email, apiToken);
        mockFetch.mockClear();
    });

    it('should create a service request successfully', async () => {
        const mockResponse: JiraServiceRequestResponse = {
            issueId: "10000",
            issueKey: "TEST-1",
            issueSelf: `${baseUrl}/rest/api/3/issue/10000`,
            serviceDeskId: "1",
            requestTypeId: "10001",
            portalUrl: `${baseUrl}/servicedesk/customer/portal/1/TEST-1`,
            requestStatus: "Open",
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: () => Promise.resolve(mockResponse),
        });

        const payload: JiraServiceRequestPayload = {
            serviceDeskId: "1",
            requestTypeId: "10001",
            requestFieldValues: {
                summary: "Test Summary",
                description: "Test Description",
            },
        };

        const result = await client.createServiceRequest(payload);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/rest/servicedeskapi/request`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error if create service request fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: "Bad Request",
            text: () => Promise.resolve("Error details"),
        });

        const payload: JiraServiceRequestPayload = {
            serviceDeskId: "1",
            requestTypeId: "10001",
            requestFieldValues: {
                summary: "Failing Request",
            },
        };

        await expect(client.createServiceRequest(payload)).rejects.toThrow(
            "Failed to create service request: 400 Bad Request - Error details"
        );
    });

    it('should get request types successfully', async () => {
        const mockRequestTypes: JiraRequestType[] = [
            { id: "100", name: "General Request", description: "", portalUrl: "" },
            { id: "101", name: "Bug Report", description: "", portalUrl: "" },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ values: mockRequestTypes }),
        });

        const serviceDeskId = "1";
        const result = await client.getRequestTypes(serviceDeskId);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json',
            },
        });
        expect(result).toEqual(mockRequestTypes);
    });

    it('should throw an error if get request types fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            text: () => Promise.resolve("Server Error"),
        });

        const serviceDeskId = "1";

        await expect(client.getRequestTypes(serviceDeskId)).rejects.toThrow(
            "Failed to fetch request types: 500 Internal Server Error - Server Error"
        );
    });
});
