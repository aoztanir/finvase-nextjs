import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Document {
  id: string;
  name: string;
  file_type: string;
  file_size?: number;
  mime_type?: string;
  file_path?: string;
  parent_id?: string;
  uploaded_by: string;
  uploader_name?: string;
  created_at: string;
  updated_at: string;
}

export function useDocuments(deal_id: string, parent_id?: string) {
  return useQuery<Document[]>({
    queryKey: ["deal-documents", deal_id, parent_id],
    queryFn: async () => {
      const params = new URLSearchParams({
        deal_id,
        ...(parent_id && { parent_id }),
      });
      
      const response = await fetch(`/api/bank/deals/${deal_id}/documents?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      return response.json();
    },
  });
}

export function useCreateFolder(deal_id: string, current_folder_id?: string) {
  const query_client = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, parent_id }: { name: string; parent_id?: string }) => {
      const response = await fetch(`/api/bank/deals/${deal_id}/documents/create-folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, parent_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      return response.json();
    },
    onMutate: async ({ name, parent_id }) => {
      // Cancel outgoing refetches
      await query_client.cancelQueries({
        queryKey: ["deal-documents", deal_id, current_folder_id]
      });

      // Snapshot previous value
      const previous_documents = query_client.getQueryData<Document[]>([
        "deal-documents", 
        deal_id, 
        current_folder_id
      ]);

      // Optimistically update
      const optimistic_folder: Document = {
        id: `temp-${Date.now()}`,
        name,
        file_type: 'folder',
        parent_id: parent_id || null,
        uploaded_by: 'current-user', // This would be from session
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      query_client.setQueryData<Document[]>(
        ["deal-documents", deal_id, current_folder_id],
        (old) => old ? [...old, optimistic_folder] : [optimistic_folder]
      );

      return { previous_documents };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous_documents) {
        query_client.setQueryData(
          ["deal-documents", deal_id, current_folder_id],
          context.previous_documents
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      query_client.invalidateQueries({
        queryKey: ["deal-documents", deal_id, current_folder_id]
      });
    },
  });
}

export function useUploadFiles(deal_id: string, current_folder_id?: string) {
  const query_client = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ files, parent_id }: { files: FileList; parent_id?: string }) => {
      const form_data = new FormData();
      Array.from(files).forEach(file => {
        form_data.append('files', file);
      });
      
      if (parent_id) {
        form_data.append('parent_id', parent_id);
      }

      const response = await fetch(`/api/bank/deals/${deal_id}/documents/upload`, {
        method: 'POST',
        body: form_data,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onMutate: async ({ files, parent_id }) => {
      // Cancel outgoing refetches
      await query_client.cancelQueries({
        queryKey: ["deal-documents", deal_id, current_folder_id]
      });

      // Snapshot previous value
      const previous_documents = query_client.getQueryData<Document[]>([
        "deal-documents", 
        deal_id, 
        current_folder_id
      ]);

      // Optimistically add uploading files
      const optimistic_files: Document[] = Array.from(files).map((file, index) => ({
        id: `uploading-${Date.now()}-${index}`,
        name: file.name,
        file_type: 'file',
        file_size: file.size,
        mime_type: file.type,
        parent_id: parent_id || null,
        uploaded_by: 'current-user',
        uploader_name: 'You',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      query_client.setQueryData<Document[]>(
        ["deal-documents", deal_id, current_folder_id],
        (old) => old ? [...old, ...optimistic_files] : optimistic_files
      );

      return { previous_documents };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous_documents) {
        query_client.setQueryData(
          ["deal-documents", deal_id, current_folder_id],
          context.previous_documents
        );
      }
    },
    onSuccess: () => {
      // Invalidate file requirements to update progress
      query_client.invalidateQueries({
        queryKey: ["file-requirements", deal_id]
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      query_client.invalidateQueries({
        queryKey: ["deal-documents", deal_id, current_folder_id]
      });
    },
  });
}