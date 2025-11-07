export function gatewayResponse<T>(code: number, data: T, message: string) {
  return {
    code,
    data,
    message,
  };
}
