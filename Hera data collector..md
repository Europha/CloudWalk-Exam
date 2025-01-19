# Security Dashboard API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
The API uses JWT (JSON Web Token) authentication. Most endpoints require a valid JWT token to be included in the request headers as a Bearer token:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Generate Authentication Token
Generate a JWT token for accessing protected endpoints.

```http
POST /api/token
```

#### Request Body
```json
{
  "username": "string",
  "password": "string"
}
```

#### Responses
- **Success (200)**
  ```json
  {
    "token": "string"
  }
  ```
- **Invalid Credentials (200)**
  ```json
  {
    "message": "invalid login"
  }
  ```

### Get Full CSV Data
Retrieve all data from the CSV file.

```http
GET /api/data/csv
```

#### Authentication
- Required: Bearer Token

#### Responses
- **Success (200)**
  ```json
  [
    {
      // CSV data entries
    }
  ]
  ```
- **Error (500)**
  ```json
  {
    "error": "string"
  }
  ```

### Get Preview Data
Retrieve a random preview of CSV data entries.

```http
GET /api/data/preview
```

#### Authentication
- Required: Bearer Token

#### Query Parameters
| Parameter | Type    | Description                                    |
|-----------|---------|------------------------------------------------|
| headers   | boolean | Include headers in response (default: true)     |

#### Responses
- **Success with Headers (200)**
  ```json
  {
    "headers": ["header1", "header2"],
    "previewData": [
      {
        "ClientIP": "string",
        "ClientRequestHost": "string",
        "ClientRequestMethod": "string",
        "ClientRequestURI": "string",
        "EdgeStartTimestamp": "string",
        "ZoneName": "string",
        "ClientASN": "string",
        "ClientCountry": "string",
        "ClientDeviceType": "string",
        "ClientSrcPort": "string",
        "ClientRequestBytes": "string",
        "ClientRequestPath": "string",
        "ClientRequestReferer": "string",
        "ClientRequestScheme": "string",
        "ClientRequestUserAgent": "string"
      }
    ]
  }
  ```
- **Success without Headers (200)**
  ```json
  [
    {
      // Preview data entries (10 random entries)
    }
  ]
  ```
- **Error (500)**
  ```json
  {
    "error": "string"
  }
  ```

### Check IP Security
Analyze IP addresses for security concerns with different depth levels.

```http
GET /api/sec/ip
```

#### Authentication
- Required: Bearer Token

#### Query Parameters
| Parameter | Type    | Description                                    |
|-----------|---------|------------------------------------------------|
| depth     | number  | Analysis depth level (1-4, default: 1)         |
| ban       | boolean | Whether to ban IPs with high attack counts     |

#### Depth Levels
1. Basic IP info for 10 random entries
2. IP info for all entries
3. Vulnerability analysis for 10 random entries
4. Attack pattern analysis with optional IP banning

#### Responses
- **Success (200)**
  ```json
  [
    {
      "ip": "string",
      "hostname": "string",
      "city": "string",
      "region": "string",
      "country": "string",
      "loc": "string",
      "org": "string",
      "postal": "string",
      "timezone": "string"
    }
  ]
  ```
- **Error (500)**
  ```json
  {
    "error": "string"
  }
  ```

### List Blacklisted IPs
Retrieve a list of blacklisted IP addresses.

```http
GET /api/sec/list
```

#### Authentication
- Required: Bearer Token

#### Responses
- **Success (200)**
  ```json
  [
    {
      "id": "number",
      "ip": "string",
      "reason": "string",
      "created_at": "string"
    }
  ]
  ```
- **No Content (404)**
  ```json
  {
    "message": "No blacklisted IPs found"
  }
  ```
- **Error (500)**
  ```json
  {
    "message": "Error retrieving blacklisted IPs",
    "error": "string"
  }
  ```

## Error Handling
All endpoints may return a 500 status code with an error message if an unexpected error occurs during processing.

## Rate Limiting
The API currently does not implement rate limiting, but it's recommended to implement it in production.
### Project Overview

This project is designed to provide a **fast and efficient file scraping solution** that recursively processes large datasets, specifically CSV files, to identify security risks, analyze potential threats, and generate insights for system administrators. The solution aims to be highly **objective and easy to use**, making it suitable for integration with systems such as **Elasticsearch**, **Graylog**, and other indexing or logging platforms. This allows for seamless data ingestion, storage, and searchability.

### Key Features:

- **File Scraping**: Efficient recursive scraping of large files, extracting relevant data for further analysis.
- **Security Analysis**: The system performs IP address analysis, vulnerability assessments, and attack pattern recognition to help security teams monitor and mitigate threats.
- **Integration Ready**: The project is designed to be easily integrated into systems like **Elasticsearch** and **Graylog**, providing powerful search and analysis capabilities for large-scale data logs.
- **Token-Based Authentication**: Access to the API is secured using **JWT tokens**, ensuring that only authorized users can retrieve sensitive data and perform sensitive actions.

### Future Enhancements

In the next phase of development, the project will be extended to include **live LLM (Large Language Model) analysis** for large files. This feature will utilize advanced AI models to analyze and interpret data in real-time, enabling system administrators to receive actionable commands directly from the AI. These commands will be generated based on the analysis of incoming logs, alerting admins about potential issues such as security threats, performance bottlenecks, or system malfunctions.

Additionally, in **emergency scenarios**, this LLM analysis will be integrated with system automation, allowing it to automatically **execute commands** (e.g., **firewall rules**, **database lockdowns**) to mitigate damage and restore system integrity.

### Example System Administrator Commands

In the event of detected security threats or performance issues, the system will be able to generate and execute the following commands to protect the system:

1. **Lockdown Database**: If the system detects unusual activity, such as excessive login attempts or vulnerability exploitation, it could recommend or automatically block access to sensitive databases.
    
    ```bash
    firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.1.100" reject'
    ```
    
    This command blocks traffic from a suspicious IP address (`192.168.1.100`) using `firewall-cmd`.
    
2. **Block IP Addresses**: If suspicious activity is detected from a particular IP, the system could automatically add a rule to block that IP:
    
    ```bash
    firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="53.153.77.110" reject'
    ```
    
    This command adds a permanent rule to block a specific IP address from accessing the system.
    
3. **Database Lockdown Command**: For cases where data integrity could be at risk, the system can automatically lock down database connections to prevent further exploitation:
    
    ```bash
    systemctl stop postgresql
    ```
    
    This stops the PostgreSQL service, preventing further database connections during an emergency.
    
4. **View Current Firewall Rules**: The system can also provide insights into the current firewall rules to help administrators assess the state of their network:
    
    ```bash
    firewall-cmd --list-all
    ```
    
5. **Restart Service After Lockdown**: After executing necessary actions, such as blocking malicious IPs or services, the system can suggest a restart of specific services to ensure a clean and safe state:
    
    ```bash
    systemctl restart nginx
    ```
    

These commands will be automatically generated based on LLM analysis and can either be executed automatically or suggested to system administrators as part of an emergency mitigation process.

### Conclusion and Next Steps

This project is built to continuously evolve as we integrate more advanced technologies like **LLM-powered analysis** and **real-time automated command execution**. The next step will involve training the AI to handle complex datasets, providing system administrators with better insights and tools for immediate action.

By combining fast and efficient data scraping with real-time AI analysis, the solution aims to help organizations improve their security posture and reduce the time between detection and response to critical security incidents.