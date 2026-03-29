import React from "react";
import { useNotification } from "@refinedev/core";
import { List } from "@refinedev/mui";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../shared/network";
import { currencyFormatter } from "../../shared/currency-formatter";

interface DuplicateProduct {
  id: string;
  name: string;
  code: string;
  isEan: boolean;
  priceHistoryCount: number;
  latestPrice: number | null;
}

interface Cluster {
  clusterId: number;
  products: DuplicateProduct[];
}

interface ClusterState {
  checked: Set<string>;
  canonicalId: string;
}

export const DuplicateList: React.FC = () => {
  const { open } = useNotification();
  const [search, setSearch] = React.useState("");
  const [clusters, setClusters] = React.useState<Cluster[]>([]);
  const [clusterStates, setClusterStates] = React.useState<
    Map<number, ClusterState>
  >(new Map());
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [mergingCluster, setMergingCluster] = React.useState<number | null>(
    null,
  );

  const findLargestGroup = (products: DuplicateProduct[]) => {
    const groups = new Map<string, DuplicateProduct[]>();
    for (const p of products) {
      const key = `${p.name.toLowerCase()}|${p.code}|${p.isEan}`;
      const group = groups.get(key) ?? [];
      group.push(p);
      groups.set(key, group);
    }
    let largest: DuplicateProduct[] = [];
    for (const group of groups.values()) {
      if (group.length > largest.length) {
        largest = group;
      }
    }
    return largest;
  };

  const initClusterStates = (clusters: Cluster[]) => {
    const states = new Map<number, ClusterState>();
    for (const cluster of clusters) {
      const largest = findLargestGroup(cluster.products);
      states.set(cluster.clusterId, {
        checked: new Set(largest.map((p) => p.id)),
        canonicalId: largest[0]?.id ?? "",
      });
    }
    setClusterStates(states);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await axiosInstance.get("/products/duplicates", {
        params: { search: search.trim() },
      });
      const result: Cluster[] = data.result?.clusters ?? [];
      setClusters(result);
      initClusterStates(result);
    } catch {
      open?.({ type: "error", message: "Failed to fetch duplicates" });
    } finally {
      setLoading(false);
    }
  };

  const toggleChecked = (clusterId: number, productId: string) => {
    setClusterStates((prev) => {
      const next = new Map(prev);
      const state = { ...next.get(clusterId)! };
      const checked = new Set(state.checked);
      if (checked.has(productId)) {
        checked.delete(productId);
        if (state.canonicalId === productId) {
          state.canonicalId = [...checked][0] ?? "";
        }
      } else {
        checked.add(productId);
      }
      state.checked = checked;
      next.set(clusterId, state);
      return next;
    });
  };

  const setCanonical = (clusterId: number, productId: string) => {
    setClusterStates((prev) => {
      const next = new Map(prev);
      next.set(clusterId, { ...next.get(clusterId)!, canonicalId: productId });
      return next;
    });
  };

  const handleMerge = async (clusterId: number) => {
    const state = clusterStates.get(clusterId);
    if (!state) return;

    const duplicateIds = [...state.checked]
      .filter((id) => id !== state.canonicalId)
      .map(Number);

    setMergingCluster(clusterId);
    try {
      await axiosInstance.post("/products/merge", {
        canonicalId: Number(state.canonicalId),
        duplicateIds,
      });
      setClusters((prev) => prev.filter((c) => c.clusterId !== clusterId));
      open?.({ type: "success", message: "Products merged successfully" });
    } catch {
      open?.({ type: "error", message: "Failed to merge products" });
    } finally {
      setMergingCluster(null);
    }
  };

  const toggleAll = (clusterId: number, products: DuplicateProduct[]) => {
    setClusterStates((prev) => {
      const next = new Map(prev);
      const state = { ...next.get(clusterId)! };
      const allChecked = products.every((p) => state.checked.has(p.id));
      if (allChecked) {
        state.checked = new Set();
        state.canonicalId = "";
      } else {
        state.checked = new Set(products.map((p) => p.id));
        if (!state.canonicalId) {
          state.canonicalId = products[0]?.id ?? "";
        }
      }
      next.set(clusterId, state);
      return next;
    });
  };

  const sortedProducts = (products: DuplicateProduct[]) =>
    [...products].sort(
      (a, b) => a.name.localeCompare(b.name) || a.code.localeCompare(b.code),
    );

  const canMerge = (clusterId: number) => {
    const state = clusterStates.get(clusterId);
    if (!state) return false;
    return state.checked.size >= 2 && state.canonicalId !== "";
  };

  return (
    <List>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <TextField
          placeholder="Search for duplicates..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          sx={{ minWidth: 300 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && searched && clusters.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          No duplicates found.
        </Typography>
      )}

      {clusters.map((cluster) => {
        const state = clusterStates.get(cluster.clusterId);
        if (!state) return null;
        const isMerging = mergingCluster === cluster.clusterId;

        return (
          <Card key={cluster.clusterId} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">
                  Cluster {cluster.clusterId} ({cluster.products.length}{" "}
                  products)
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!canMerge(cluster.clusterId) || isMerging}
                  onClick={() => handleMerge(cluster.clusterId)}
                  startIcon={
                    isMerging ? <CircularProgress size={16} /> : undefined
                  }
                >
                  Merge
                </Button>
              </Box>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          cluster.products.length > 0 &&
                          cluster.products.every((p) =>
                            state.checked.has(p.id),
                          )
                        }
                        indeterminate={
                          state.checked.size > 0 &&
                          state.checked.size < cluster.products.length
                        }
                        onChange={() =>
                          toggleAll(cluster.clusterId, cluster.products)
                        }
                      />
                    </TableCell>
                    <TableCell padding="checkbox">Canonical</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>EAN</TableCell>
                    <TableCell align="right">Latest Price</TableCell>
                    <TableCell align="right">Price History</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProducts(cluster.products).map((product) => {
                    const isChecked = state.checked.has(product.id);
                    const isCanonical = state.canonicalId === product.id;

                    return (
                      <TableRow key={product.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isChecked}
                            onChange={() =>
                              toggleChecked(cluster.clusterId, product.id)
                            }
                          />
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Radio
                            checked={isCanonical}
                            disabled={!isChecked}
                            onChange={() =>
                              setCanonical(cluster.clusterId, product.id)
                            }
                          />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.isEan ? "Yes" : "No"}</TableCell>
                        <TableCell align="right">
                          {product.latestPrice != null
                            ? currencyFormatter.format(product.latestPrice)
                            : "—"}
                        </TableCell>
                        <TableCell align="right">
                          {product.priceHistoryCount}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </List>
  );
};
