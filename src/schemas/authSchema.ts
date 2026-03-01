import { z } from "zod";

export const LoginReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  deviceName: z.string().min(2)
});

export type LoginReq = z.infer<typeof LoginReqSchema>;