import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Master data rarely changes - cache for 5 minutes
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook to fetch and cache master data across the application.
 * Uses React Query for efficient caching and deduplication of requests.
 * 
 * Benefits:
 * - Data is fetched only once and cached
 * - Subsequent page navigations use cached data
 * - Automatic background refetching when stale
 * - Shared across all components
 */
export function useMasterData() {
    const industries = useQuery({
        queryKey: ['master', 'industries'],
        queryFn: api.getIndustries,
        staleTime: STALE_TIME,
    });

    const users = useQuery({
        queryKey: ['master', 'users'],
        queryFn: api.getUsers,
        staleTime: STALE_TIME,
    });

    const stages = useQuery({
        queryKey: ['master', 'stages'],
        queryFn: api.getStages,
        staleTime: STALE_TIME,
    });

    const statuses = useQuery({
        queryKey: ['master', 'statuses'],
        queryFn: api.getStatuses,
        staleTime: STALE_TIME,
    });

    const lobs = useQuery({
        queryKey: ['master', 'lobs'],
        queryFn: api.getIndustryLOBs,
        staleTime: STALE_TIME,
    });

    const cities = useQuery({
        queryKey: ['master', 'cities'],
        queryFn: api.getCities,
        staleTime: STALE_TIME,
    });

    const leadSources = useQuery({
        queryKey: ['master', 'leadSources'],
        queryFn: api.getLeadSources,
        staleTime: STALE_TIME,
    });

    const products = useQuery({
        queryKey: ['master', 'products'],
        queryFn: api.getProductsMaster,
        staleTime: STALE_TIME,
    });

    const countries = useQuery({
        queryKey: ['master', 'countries'],
        queryFn: api.getCountries,
        staleTime: STALE_TIME,
    });

    return {
        // Data arrays with fallback to empty arrays
        industries: industries.data || [],
        users: users.data || [],
        stages: stages.data || [],
        statuses: statuses.data || [],
        lobs: lobs.data || [],
        cities: cities.data || [],
        leadSources: leadSources.data || [],
        products: products.data || [],
        countries: countries.data || [],

        // Loading state - true if any master data is still loading
        isLoading:
            industries.isLoading ||
            users.isLoading ||
            stages.isLoading ||
            statuses.isLoading ||
            lobs.isLoading ||
            cities.isLoading,

        // Error state
        isError:
            industries.isError ||
            users.isError ||
            stages.isError,

        // Refetch function to force refresh all master data
        refetchAll: () => {
            industries.refetch();
            users.refetch();
            stages.refetch();
            statuses.refetch();
            lobs.refetch();
            cities.refetch();
            leadSources.refetch();
            products.refetch();
            countries.refetch();
        },
    };
}

/**
 * Hook to fetch just the accounts list with caching
 */
export function useAccounts() {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: api.getAllAccounts,
        staleTime: 60 * 1000, // 1 minute - accounts change more frequently
    });
}

/**
 * Hook to fetch leads with caching
 */
export function useLeads() {
    return useQuery({
        queryKey: ['leads'],
        queryFn: api.getLeads,
        staleTime: 30 * 1000, // 30 seconds - leads change frequently
    });
}

/**
 * Hook to fetch dashboard stats
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: api.getDashboardStats,
        staleTime: 60 * 1000, // 1 minute
    });
}
