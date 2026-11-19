import { BadGatewayException } from '@nestjs/common';

export async function serviceFetch(url: URL, options?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw new BadGatewayException('Dịch vụ nội bộ hiện không phản hồi.');
  }
}

export function serviceOrigin(name: string, port: number): string {
  const key = name.toUpperCase().replaceAll('-', '_') + '_URL';
  return process.env[key] ?? `http://127.0.0.1:${port}`;
}
