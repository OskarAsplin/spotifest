export const getApiBaseUrl = () => process.env.REACT_APP_BACKEND_URL!;

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
  body?: string
): Promise<T> => {
  const OPTIONS: RequestInit = {
    headers: getHeaders(),
    method,
    body: body || null,
  };
  const res = await fetch(path, OPTIONS);
  return await res.json();
};

export const fetchGet = <T>(path: string) =>
  fetchRequest<T>(RequestMethod.GET, path);

export const fetchPost = <T>(path: string, body: string) =>
  fetchRequest<T>(RequestMethod.POST, path, body);
