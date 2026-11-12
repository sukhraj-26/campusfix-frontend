const API_BASE = 'http://localhost:8080/api';

export const fetchComplaints = async () => {
  const response = await fetch(`${API_BASE}/complaints`);
  if (!response.ok) throw new Error('Failed to fetch complaints');
  return response.json();
};

export const createComplaint = async (complaintData) => {
  const response = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complaintData),
  });
  if (!response.ok) throw new Error('Failed to submit complaint');
  return response.json();
};