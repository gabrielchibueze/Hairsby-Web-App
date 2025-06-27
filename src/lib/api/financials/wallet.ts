import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  escrowBalance: number;
  currency: string;
  status: string;
  lastTransactionAt?: string;
  bankAccounts?: Array<{
    id: string;
    accountNumber?: string;
    bankName?: string;
    country?: string;
    currency?: string;
    status?: string;
  }>;
  defaultBankAccountId?: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  reference: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date | string;
  amount: number;
  currency: string;
  type:
    | "deposit"
    | "withdrawal"
    | "transfer"
    | "payment"
    | "refund"
    | "escrow_hold"
    | "escrow_release";

  status: "pending" | "completed" | "failed" | "cancelled" | "reversed";
}

export interface Payout {
  id: string;
  providerId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  paymentMethod: string;
  bankDetails: any;
  currency?: string;
}
export interface AddFundsPayload {
  amount: number;
  paymentMethodId: string;
}

export interface WithdrawFundsPayload {
  amount: number;
}

export interface TransferFundsPayload {
  recipientId: string;
  amount: number;
  note?: string;
}

export interface BankAccountPayload {
  token: string;
  // accountNumber: string;
  // routingNumber: string;
  bankName: string;
  country: string;
  currency: string;
  accountHolderName: string;
  accountHolderType: string;
}

export interface UpdateBankAccountPayload {
  accountHolderName?: string;
  bankName?: string;
}

export async function getWallet() {
  try {
    const response = await axios.get(`${API_URL}/wallet`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    // Return dummy data if API fails
    // return {
    //   id: "wallet-123",
    //   userId: "user-456",
    //   balance: 1000.0,
    //   escrowBalance: 200.0,
    //   currency: "GBP",
    //   status: "active",
    //   bankAccounts: [
    //     {
    //       id: "bank-789",
    //       accountNumber: "****1234",
    //       bankName: "Example Bank",
    //       country: "US",
    //       currency: "GBP",
    //       status: "active",
    //     },
    //   ],
    //   defaultBankAccountId: "bank-789",
    // };
  }
}

// export async function getTransactions({
//   page = 1,
//   limit = 10,
//   type,
// }: {
//   page?: number;
//   limit?: number;
//   type?: string;
// } = {}) {
//   try {
//     const response = await axios.get(`${API_URL}/wallet/transactions`, {
//       params: { page, limit, type },
//     });
//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//   }
// }

// types/transaction.ts

export interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}
export async function getTransactions({
  page = 1,
  limit = 10,
  type,
}: {
  page?: number;
  limit?: number;
  type?: string;
} = {}): Promise<PaginatedTransactions> {
  try {
    const response = await axios.get<{
      success: boolean;
      data: PaginatedTransactions;
    }>(`${API_URL}/wallet/transactions`, {
      params: { page, limit, type },
      withCredentials: true,
    });

    if (!response.data.success) {
      throw new Error("Failed to fetch transactions");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export function calculateTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);
      const isIncome =
        transaction.type === "deposit" || transaction.type === "escrow_release";
      const isCompleted = transaction.status === "completed";

      if (isCompleted) {
        acc.totalRevenue += amount;
        if (isIncome) {
          acc.totalIncome += amount;
        } else {
          acc.totalExpenses += amount;
        }
      }
      return acc;
    },
    { totalRevenue: 0, totalIncome: 0, totalExpenses: 0 }
  );
}
export async function addFunds(payload: AddFundsPayload) {
  try {
    const response = await axios.post(`${API_URL}/wallet/deposit`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error adding funds:", error);
    throw error;
  }
}

export async function withdrawFunds(payload: WithdrawFundsPayload) {
  try {
    const response = await axios.post(`${API_URL}/wallet/withdraw`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    throw error;
  }
}

export async function transferFunds(payload: TransferFundsPayload) {
  try {
    const response = await axios.post(`${API_URL}/wallet/transfer`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error transferring funds:", error);
    throw error;
  }
}

export async function addBankAccount(payload: BankAccountPayload) {
  try {
    const response = await axios.post(
      `${API_URL}/wallet/bank-accounts`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding bank account:", error);
    throw error;
  }
}

export async function setDefaultBankAccount(bankAccountId: string) {
  try {
    const response = await axios.put(
      `${API_URL}/wallet/bank-accounts/default`,
      {
        bankAccountId,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error setting default bank account:", error);
    throw error;
  }
}

export async function removeBankAccount(bankAccountId: string) {
  try {
    const response = await axios.delete(
      `${API_URL}/wallet/bank-accounts/${bankAccountId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error removing bank account:", error);
    throw error;
  }
}

export async function updateBankAccount(
  bankAccountId: string,
  payload: UpdateBankAccountPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/wallet/bank-accounts/${bankAccountId}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating bank account:", error);
    throw error;
  }
}
