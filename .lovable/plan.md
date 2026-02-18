

## Add Delete Button for Failed Clusters

### What Changes

**1. `src/hooks/useContentClusters.ts` -- Add `useDeleteCluster` hook**
- New mutation that deletes cluster items first (via `cluster_items` table where `cluster_id` matches), then deletes the cluster record from `content_clusters`
- Invalidates the `content-clusters` query cache on success
- Shows toast confirmation

**2. `src/pages/admin/ContentClusterGenerator.tsx` -- Add delete UI in two places**

**A. Failed cluster detail view (lines 336-353):**
- Add a red "Delete Cluster" button next to the existing "Try Again" button
- Uses an AlertDialog confirmation before deleting
- After deletion, clears `selectedClusterId` so the detail panel resets

**B. Cluster list sidebar (lines 265-295):**
- Add a small trash icon button on failed cluster entries
- Only visible when `cluster.status === 'failed'`
- Also uses AlertDialog confirmation

### New imports needed
- `Trash2` icon from lucide-react
- `AlertDialog` components for confirmation
- `useDeleteCluster` from the hooks file

### User Flow
1. User sees a failed cluster in the sidebar list with a trash icon
2. Clicking trash (or the "Delete Cluster" button in the detail view) opens a confirmation dialog
3. Confirming deletes all associated cluster items and the cluster record
4. The list refreshes and the detail panel resets

