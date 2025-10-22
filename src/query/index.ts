import { axiosInstace, axiosInstaceBackend } from "@/lib/axiosInstanct";
import { ChatHistortLists, ConversationResponse, SendMessageResponse } from "@/types/queryType";
import { Authorization } from "@/utils/cookies";
import { computeHmac } from "@/utils/hmac";
import { useMutation, useQuery,useQueryClient  } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";


export const useChatHistoryLists = () => {
  const authorization = Authorization();
  return useQuery<ChatHistortLists[]>({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const response = await axiosInstace.get<ChatHistortLists[]>("/chat-history", {
        headers: {
          Authorization: authorization,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};



export const useSendMessageMutation = () => {
  const authorization = Authorization();

  return useMutation<
    SendMessageResponse,
    SendMessageResponse,
    { session_id: string; input: string; stream: boolean; signal?: AbortSignal }
  >({
    mutationFn: async (payload) => {
      const { signal, ...body } = payload;
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body,
        header: authorization.split(" ")[1],
      });
      const xApiKey = await computeHmac(messageToSign, secretKey);
      console.log("xApiKey",xApiKey)
      // ✅ Normal (non-streaming) behavior
      if (!body.stream) {
        const response = await axiosInstace.post(`/send-message`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
            "x-api-key": xApiKey,
          },
          signal,
        });
        return response.data;
      }


      const res = await fetch(`/api/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
          "x-api-key": xApiKey,
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (part.startsWith("data:")) {
            const cleaned = part.replace(/^data:\s*/, "").trim();
            if (cleaned && cleaned !== "[DONE]") {
              fullText += cleaned; 
            }
          }
        }
      }

    
      return {
        session_id: body.session_id,
        response: {
          messages: [
            {
              id: crypto.randomUUID(),
              content: fullText,
              additional_kwargs: {},
              response_metadata: {},
              type: "ai",
              name: null,
              example: false,
            },
          ],
        },
      } as SendMessageResponse;
    },
  });
};




export const useConversationLists = () => {
  const authorization = Authorization();
  const { conversationId } = useParams();
  return useQuery<ConversationResponse>({
    queryKey: ["conversations", { conversationId }],
    queryFn: async () => {
      const response = await axiosInstace.get<ConversationResponse>(
        `/conversations?session_id=${conversationId}`,
        {
          headers: { Authorization: authorization },
        }
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};




export const useSendWidgetMessage = () => {
  return useMutation<
    AsyncGenerator<string, void, unknown>,
    Error,
    { input: string; stream: true }
  >({
    mutationFn: async ({ input }) => {
      const res = await fetch("/api/chat-widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, stream: true }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      async function* streamGenerator() {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            if (part.startsWith("data:")) {
              const cleaned = part.replace(/^data:\s*/, "").trim();
              if (cleaned && cleaned !== "[DONE]") {
                yield cleaned; 
              }
            }
          }
        }
      }

      return streamGenerator();
    },
  });
};

export const useSoftDeleteConversation = () => {
  const authorization = Authorization();
  const queryClient = useQueryClient(); // ✅ Access React Query cache

  return useMutation<
    { success: boolean; message: string },
    Error,
    { session_id: string }
  >({
    mutationFn: async ({ session_id }) => {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body: { session_id },
        header: authorization.split(" ")[1],
      });
      const xApiKey = await computeHmac(messageToSign, secretKey);

      const res = await fetch(`/api/soft-delete?session_id=${session_id}`, {
        method: "DELETE",
        headers: {
          Authorization: authorization,
          "x-api-key": xApiKey,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete conversation");
      }

      return res.json();
    },

    // ✅ After success, refresh chat history automatically
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
    },
  });
};



export const useArchivedConversations = () => {
  const authorization = Authorization();

  return useQuery({
    queryKey: ["archived-conversations"],
    queryFn: async () => {
      const response = await axiosInstace.get("/archived-list", {
        headers: { Authorization: authorization },
      });

      // ✅ unwrap the sessions array
      return response.data.sessions || [];
    },
    refetchOnWindowFocus: false,
  });
};



export const useRestoreConversation = () => {
  const authorization = Authorization();
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { session_id: string }
  >({
    mutationFn: async ({ session_id }) => {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body: { session_id },
        header: authorization.split(" ")[1],
      });
      const xApiKey = await computeHmac(messageToSign, secretKey);

      // ✅ Use POST (your backend expects this)
      const res = await fetch(`/api/restore-message?session_id=${session_id}`, {
        method: "POST",
        headers: {
          Authorization: authorization,
          "x-api-key": xApiKey,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to restore conversation");
      }

      return res.json();
    },

    // ✅ Refresh cache automatically after restore
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archived-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
    },
  });
};


//   const payloadObj = {
//     input: inputValue,
//     session_id: "25752600-d4a8-4364-9696-2cf1efe6ffc6",
//     stream: false,
//   };
//   const payload = JSON.stringify(payloadObj);

//   const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
//   const messageToSign = JSON.stringify({
//     body: payloadObj,
//     header: sessionStorage.getItem("jwt_token"),
//   });
//   const xApiKey = await computeHmac(messageToSign, secretKey);

//   // 4️⃣ Send API request
//  const res = await fetch("/api/send-message", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
//       "x-api-key": xApiKey,
//     },
//     body: payload,
//   });
