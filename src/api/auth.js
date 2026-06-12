const BASE_URL = 'http://localhost:5001/api/v1';

export async function registerUser(user_phone_number) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_phone_number }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send OTP. Please try again.');
  }
  return data;
}

export async function verifyOTP({
  user_phone_number,
  otp_origin,
  otp,
  user_name,
  user_password,
}) {
  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_phone_number,
      otp_origin,
      otp,
      user_name,
      user_password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'OTP verification failed.');
  }
  return data;
}

export async function loginUser(user_phone_number, user_password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_phone_number, user_password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Invalid credentials or login failed.');
  }
  return data;
}
