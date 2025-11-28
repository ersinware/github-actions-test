export const ACTIVE_VERSIONS = ['1', '2'];

export const VERSION_DETAILS: Record<string, { title: string; description: string }> = {
  '1': { title: 'API Documentation V1', description: 'Legacy API endpoints' },
  '2': {
    title: 'API Documentation V2',
    description: 'New generation API endpoints',
  },
};

export const TAG_DESCRIPTIONS: Record<string, string> = {
  health: 'System health check endpoints',
  cats: 'Operations related to cats management',
  // Future additions example:
  // 'users': 'User management operations',
  // 'auth': 'Authentication services',
};

export const VERSION_TAG_MAP: Record<string, string[]> = {
  '1': ['health', 'cats'],
  '2': ['health', 'cats'],
  // Example: If 'dogs' existed in v2, you would use: ['health', 'cats', 'dogs']
};
