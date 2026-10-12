import { JiraServiceRequestPayload, JiraServiceRequestResponse, JiraRequestType } from './types';

export class JiraServiceManagementClient {
    private baseUrl: string;
    private apiToken: string;
    private email: string;

    constructor(baseUrl: string, email: string, apiToken: string) {
        this.baseUrl = baseUrl;
        this.email = email;
        this.apiToken = apiToken;
    }

    private getAuthHeader(): string {
        const credentials = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
        return `Basic ${credentials}`;
    }

    async createServiceRequest(requestPayload: JiraServiceRequestPayload): Promise<JiraServiceRequestResponse> {
        const url = `${this.baseUrl}/rest/servicedeskapi/request`;
        const headers = {
            'Authorization': this.getAuthHeader(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to create service request: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            return await response.json() as JiraServiceRequestResponse;
        } catch (error) {
            // console.error('Error creating service request:', error);
            throw error;
        }
    }

    async getRequestTypes(serviceDeskId: string): Promise<JiraRequestType[]> {
        const url = `${this.baseUrl}/rest/servicedeskapi/servicedesk/${serviceDeskId}/requesttype`;
        const headers = {
            'Authorization': this.getAuthHeader(),
            'Accept': 'application/json',
        };

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to fetch request types: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const data = await response.json();
            return data.values as JiraRequestType[];
        } catch (error) {
            // console.error('Error fetching request types:', error);
            throw error;
        }
    }
}
