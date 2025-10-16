"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "@/iib/api";
import { useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE = 50;
const LOAD_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function DataTable() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
        queryKey: ["dataTable"],
        queryFn: async ({ pageParam = 0 }) => {
            await sleep(LOAD_DELAY_MS);
            return fetchData(pageParam, PAGE_SIZE);
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) return undefined;
            return allPages.length * PAGE_SIZE;
        },
        initialPageParam: 0,
    });

    const triggerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!triggerRef.current || !scrollContainerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    console.log("🔄 Loading more data...");
                    fetchNextPage();
                }
            },
            {
                root: scrollContainerRef.current,
                rootMargin: "200px",
                threshold: 0.1,
            }
        );

        observer.observe(triggerRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    const rows = data?.pages.flat() ?? [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{rows.length}</span> items loaded
                    {hasNextPage && <span className="ml-2">(more available...)</span>}
                </div>
                {isFetching && (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span>Loading...</span>
                    </div>
                )}
            </div>

            <div ref={scrollContainerRef} className="rounded-md border max-h-[70vh] overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Bio</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Created Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.language}</TableCell>
                                <TableCell>{row.bio}</TableCell>
                                <TableCell>{row.version}</TableCell>
                                <TableCell>{row.state}</TableCell>
                                <TableCell>{row.created_date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {isFetchingNextPage && <div className="border-t bg-muted/50 py-4 text-center text-sm text-muted-foreground">Loading {PAGE_SIZE} more items...</div>}

                {hasNextPage && (
                    <div ref={triggerRef} className="flex h-20 items-center justify-center text-sm text-muted-foreground">
                        {!isFetchingNextPage && "Scroll down to load more..."}
                    </div>
                )}

                {!hasNextPage && !isFetching && <div className="border-t bg-muted/50 py-4 text-center text-sm text-muted-foreground">All {rows.length} items loaded</div>}
            </div>
        </div>
    );
}
