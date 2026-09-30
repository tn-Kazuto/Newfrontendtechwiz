export const EVENT_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

export const eventApi = {
  listEvents: async (token: string, page = 1, size = 100) => {
    const res = await fetch(`${EVENT_URL}/api/v1/events?Page=${page}&Size=${size}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  getEventDetails: async (token: string, id: string) => {
    const res = await fetch(`${EVENT_URL}/api/v1/events/${id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};