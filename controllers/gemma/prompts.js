// Option 1: Using template literals with functions
export const decisionPrompt = (message) => 
`Analyze this user query and determine if Wikipedia search is needed.
Query: "${message}"
Respond with ONLY 'YES' or 'NO' based on these criteria:
Use Wikipedia (YES) if:
- Query asks about specific people, places, events, or historical facts
- Query needs current statistics or detailed information
- Query requires accurate definitions of scientific/technical concepts
- User explicitly asks for Wikipedia information

Don't use Wikipedia (NO) if:
- Simple math or calculations
- Creative writing requests (poems, stories, etc.)
- General conversation or opinions
- Code generation or programming help
- Questions answerable from general knowledge
- Casual greetings or small talk

Decision (YES or NO):`;

export const extractPrompt = (message) => 
`Extract the main topic or subject from this query that should be searched on Wikipedia. Return ONLY the search term, nothing else.
Query: "${message}"
Search term:`;

export const finalPrompt = (message, title, summary) => 
`Please keep the answer short and concise.

User query: ${message}

Wikipedia information about "${title}":
${summary}

Based on this Wikipedia information, answer the user's query:`;

// Option 2: Using regular functions (more explicit)
export function getDecisionPrompt(message) {
    return `Analyze this user query and determine if Wikipedia search is needed.

Query: "${message}"

Respond with ONLY 'YES' or 'NO' based on these criteria:

Use Wikipedia (YES) if:
- Query asks about specific people, places, events, or historical facts
- Query needs current statistics or detailed information
- Query requires accurate definitions of scientific/technical concepts
- User explicitly asks for Wikipedia information

Don't use Wikipedia (NO) if:
- Simple math or calculations
- Creative writing requests (poems, stories, etc.)
- General conversation or opinions
- Code generation or programming help
- Questions answerable from general knowledge
- Casual greetings or small talk

Decision (YES or NO):`;
}

export function getExtractPrompt(message) {
    return `Extract the main topic or subject from this query that should be searched on Wikipedia. Return ONLY the search term, nothing else.

Query: "${message}"

Search term:`;
}

export function getFinalPrompt(message, title, summary) {
    return `Please keep the answer short and concise.

User query: ${message}

Wikipedia information about "${title}":
${summary}

Based on this Wikipedia information, answer the user's query:`;
}