export type CheckoutSuccessPayload = {
  orderId: string;
  email: string;
  total: number;
  status: string;
  paymentProvider?: string | null;
  paymentCompletion?: string;
  accountCreated?: boolean;
  temporaryPassword?: string;
};

const KEY = "sqspeptides_checkout_success_v1";

export function saveCheckoutSuccess(data: CheckoutSuccessPayload): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function loadCheckoutSuccess(expectedOrderId?: string): CheckoutSuccessPayload | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CheckoutSuccessPayload;
    if (!data?.orderId) return null;
    if (expectedOrderId && data.orderId !== expectedOrderId) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearCheckoutSuccess(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function orderToCheckoutSuccess(order: {
  id: string;
  email: string;
  total: number;
  status: string;
  paymentProvider?: string | null;
  paymentCompletion?: string;
  accountCreated?: boolean;
  temporaryPassword?: string;
}): CheckoutSuccessPayload {
  return {
    orderId: order.id,
    email: order.email,
    total: order.total,
    status: order.status,
    paymentProvider: order.paymentProvider,
    paymentCompletion: order.paymentCompletion,
    accountCreated: order.accountCreated,
    temporaryPassword: order.temporaryPassword,
  };
}
