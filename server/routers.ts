import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  screening: router({
    getLatest: protectedProcedure.query(async ({ ctx }) => {
      const { getLatestScreening } = await import("./db");
      return await getLatestScreening(ctx.user.id);
    }),
    save: protectedProcedure
      .input(
        z.object({
          partAScore: z.number().min(0).max(6),
          likelihood: z.enum(["Low", "Moderate", "High"]),
          q1Response: z.number().min(1).max(5),
          q2Response: z.number().min(1).max(5),
          q3Response: z.number().min(1).max(5),
          q4Response: z.number().min(1).max(5),
          q5Response: z.number().min(1).max(5),
          q6Response: z.number().min(1).max(5),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { saveScreening } = await import("./db");
        await saveScreening({
          userId: ctx.user.id,
          partAScore: input.partAScore,
          likelihood: input.likelihood,
          q1Response: input.q1Response,
          q2Response: input.q2Response,
          q3Response: input.q3Response,
          q4Response: input.q4Response,
          q5Response: input.q5Response,
          q6Response: input.q6Response,
          completedAt: new Date(),
        });
        return { success: true };
      }),
  }),

  vitals: router({
    getLatest: protectedProcedure.query(async ({ ctx }) => {
      const { getLatestVitals } = await import("./db");
      return await getLatestVitals(ctx.user.id);
    }),
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const { getVitalsHistory } = await import("./db");
      return await getVitalsHistory(ctx.user.id);
    }),
    record: protectedProcedure
      .input(
        z.object({
          systolicBP: z.number().min(50).max(250),
          diastolicBP: z.number().min(30).max(150),
          heartRate: z.number().min(30).max(200),
          medicationReadiness: z.enum(["Ready", "Requires Review"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { saveVitals } = await import("./db");
        await saveVitals({
          userId: ctx.user.id,
          systolicBP: input.systolicBP,
          diastolicBP: input.diastolicBP,
          heartRate: input.heartRate,
          medicationReadiness: input.medicationReadiness,
          notes: input.notes,
          recordedAt: new Date(),
        });
        return { success: true };
      }),
  }),

  clinics: router({
    getAll: publicProcedure.query(async () => {
      const { UK_ADHD_CLINICS } = await import("@shared/clinics");
      return UK_ADHD_CLINICS;
    }),
  }),

  referral: router({
    generateReport: protectedProcedure.query(async ({ ctx }) => {
      const { getLatestScreening } = await import("./db");
      const { getLatestVitals } = await import("./db");
      const screening = await getLatestScreening(ctx.user.id);
      const vitals = await getLatestVitals(ctx.user.id);

      return {
        screening,
        vitals,
        readinessStatus:
          screening && vitals
            ? screening.likelihood === "High" && vitals.medicationReadiness === "Ready"
              ? "Referral Ready"
              : "Action Required"
            : "Incomplete",
        generatedAt: new Date(),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
