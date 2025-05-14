"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/contexts/auth.context";
import { getWallet, Wallet } from "@/lib/api/financials/wallet";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface BankAccount {
  id: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
}

export function BankAccountSelector({
  onSelect,
}: {
  onSelect: (account: {
    accountNumber: string;
    sortCode: string;
  }) => void;
}) {
  const { user } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const { data: wallet, isLoading } = useQuery({
    queryKey: ["provider-wallet"],
    queryFn: () => getWallet(), 
  });

  useEffect(() => {
    if (wallet?.bankAccounts) {
      // Transform the bank accounts to match our expected format
      const accounts = wallet.bankAccounts.map((account:any) => ({
        id: account.id,
        accountNumber: account.accountNumber || '',
        sortCode: account.sortCode || '', // Add sortCode if available from API
        bankName: account.bankName || 'Unknown Bank'
      }));
      setBankAccounts(accounts);

      // Set default selected account
      if (accounts.length > 0) {
        const defaultAccount = wallet.defaultBankAccountId 
          ? accounts.find((acc: BankAccount) => acc.id === wallet.defaultBankAccountId)
          : accounts[0];
        if (defaultAccount) {
          setSelectedAccountId(defaultAccount.id);
          onSelect({
            accountNumber: defaultAccount.accountNumber,
            sortCode: defaultAccount.sortCode,
          });
        }
      }
    }
  }, [wallet, onSelect]);

  const handleChange = (value: string) => {
    const account = bankAccounts.find((acc) => acc.id === value);
    if (account) {
      setSelectedAccountId(account.id);
      onSelect({
        accountNumber: account.accountNumber,
        sortCode: account.sortCode,
      });
    }
  };

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading bank accounts..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <div className="space-y-4">
      <Select 
        onValueChange={handleChange}
        value={selectedAccountId || undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select bank account" />
        </SelectTrigger>
        <SelectContent>
          {bankAccounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.bankName} •••• {account.accountNumber.slice(-4)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {bankAccounts.length === 0 && (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No bank accounts found. Please add one in your wallet settings.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}