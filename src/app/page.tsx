"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/iib/react-query";
import DataTable from "@/components/data-table/DataTable";

export default function Page() {
    return (
        <QueryClientProvider client={queryClient}>
            <main className="container mx-auto py-10">
                <DataTable />
            </main>
        </QueryClientProvider>
    );
}
