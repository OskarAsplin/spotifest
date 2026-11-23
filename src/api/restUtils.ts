enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const getHeaders = (): Headers =>
  new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  });

const fetchRequest = async <T>(
  method: string,
  path: string,
  body?: string,
): Promise<T> => {
  const OPTIONS: RequestInit = {
    headers: getHeaders(),
    method,
    body: body || null,
  };
  const res = await fetch(path, OPTIONS);
  if (res.status === 429 || res.status >= 500) throw new HttpError(res.status);
  return await res.json();
};

export class HttpError extends Error {
  constructor(public status: number) {
    super(`Request failed with status ${status}`);
  }
}

export const fetchGet = <T>(path: string) =>
  fetchRequest<T>(RequestMethod.GET, path);

export const fetchPost = <T>(path: string, body: string) =>
  fetchRequest<T>(RequestMethod.POST, path, body);
