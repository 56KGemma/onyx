// src/types.ts

export interface JiraServiceRequestPayload {
    serviceDeskId: string;
    requestTypeId: string;
    requestFieldValues: {
        summary: string;
        description?: string;
        [key: string]: any; // Allow for arbitrary custom fields
    };
}

export interface JiraServiceRequestResponse {
    issueId: string;
    issueKey: string;
    issueSelf: string;
    serviceDeskId: string;
    requestTypeId: string;
    portalUrl: string;
    requestStatus: string;
}

export interface JiraRequestType {
    id: string;
    name: string;
    description: string;
    portalUrl: string;
    // Add other relevant fields from Jira API if needed
}
