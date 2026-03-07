import { Groq } from 'groq-sdk';

export const toolDefinitions = [
  {
    type: 'function' as const,
    function: {
      name: 'get_current_datetime',
      description: 'Get the current date and time. Use this tool whenever you need to know the current time or date.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
];

const tools: Record<string, (args: unknown) => unknown> = {
  get_current_datetime: () => {
    const now = new Date();
    return {
      datetime: now.toISOString(),
      date: now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },
};

export function executeTool(name: string, args: unknown): unknown {
  const tool = tools[name];
  if (!tool) {
    return { error: `Tool '${name}' not found` };
  }
  try {
    return tool(args);
  } catch (error) {
    return { error: `Error executing tool: ${error}` };
  }
}
