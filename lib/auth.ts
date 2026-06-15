import { betterAuth } from "better-auth";
import type { User } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, twoFactor, emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailServerUser = process.env.EMAIL_SERVER_USER || "";
const emailServerHost = process.env.EMAIL_SERVER_HOST || "";
const emailServerPort = parseInt(process.env.EMAIL_SERVER_PORT || "465");
const emailFrom = `Osman Zakir <${process.env.EMAIL_FROM || ""}>`;
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD || "";
const baseURL = process.env.BETTER_AUTH_URL || "";

const transporter = nodemailer.createTransport({
  host: emailServerHost,
  port: emailServerPort,
  secure: true,
  auth: {
    user: emailServerUser,
    pass: emailServerPassword
  }
});

export const auth = betterAuth({
  baseURL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  user: {
    changeEmail: {
      enabled: true
    },
    deleteAccount: {
      enabled: true
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log("VERIFY EMAIL TRIGGERED", user.email, url);
      const result = await transporter.sendMail({
        from: emailFrom,
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`,
        text: `Click the link to verify your email: ${url}`
      });

      if (result.rejected.includes(user.email)) {
        console.error("Failed to send verification email");
        throw new Error("Failed to send verification email. Please try again.");
      } else if (result.accepted.includes(user.email)) {
        console.log("Verification email sent");
      }
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    onExistingUserSignUp: async ({ user }: { user: User }) => {
		// Notify the existing user that someone tried to sign up with their email
		await transporter.sendMail({
			from: emailFrom,
			to: user.email,
			subject: "Sign-up attempt with your email",
			text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email."
		});
	}
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      updateUserInfoOnLink: true
    }
  },
  advanced: {
    database: {
      generateId: "uuid"
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const result = await transporter.sendMail({
        from: emailFrom,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link to reset your password: <a href="${url}">${url}</a></p>`,
        text: `Click the link to reset your password: ${url}`
      });

      if (result.rejected.includes(user.email)) {
        console.error("Failed to send reset password email:", result.rejected.length > 0 ? result.rejected[0] : "Unknown error");
        throw new Error("Failed to send reset password email. Please try again.");
      } else if (result.accepted.includes(user.email)) {
        console.log("Reset password email sent:", result.accepted.length > 0 ? result.accepted[0] : "Unknown recipient");
      }
    },
    autoSignIn: true,
    requireEmailVerification: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string
    }
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const result = await transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: "Your Magic Link",
          html: `<p>Click the link to sign in: <a href="${url}">${url}</a></p>`,
          text: `Click the link to sign in: ${url}`
        });
        if (result.rejected.includes(email)) {
          console.error("Failed to send magic link email:", result.rejected.length > 0 ? result.rejected[0] : "Unknown error");
          throw new Error("Failed to send magic link. Please try again.");
        } else if (result.accepted.includes(email)) {
          console.log("Magic link email sent:", result.accepted.length > 0 ? result.accepted[0] : "Unknown recipient");
        }
      }
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          const result = await transporter.sendMail({
            from: emailFrom,
            to: user.email,
            subject: "Your Two-Factor Authentication Code",
            html: `<p>Your 2FA code is: <strong>${otp}</strong></p>`,
            text: `Your 2FA code is: ${otp}`
          });

          if (result.rejected.includes(user.email)) {
            console.error("Failed to send 2FA email:", result.rejected.length > 0 ? result.rejected[0] : "Unknown error");
            throw new Error("Failed to send 2FA code. Please try again.");
          } else if (result.accepted.includes(user.email)) {
            console.log("2FA email sent:", result.accepted.length > 0 ? result.accepted[0] : "Unknown recipient");
          }
        }
      }
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        let subject = "";

        if (type === "sign-in") {
          subject = "Your sign-in code";
        } else if (type === "forget-password") {
          subject = "Your password reset code";
        } else if (type === "email-verification") {
          subject = "Your verification code";
        }
        const text = `${subject} is: ${otp}.`;

        const result = await transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: "Your OTP Code",
          html: `<p>${text}</p>`,
          text
        });

        if (result.rejected.includes(email)) {
          console.error("Failed to send OTP email:", email);
          throw new Error("Failed to send OTP code. Please try again.");
        } else if (result.accepted.includes(email)) {
          console.log("OTP email sent:", email);
        }
      }
    }),
    nextCookies()
  ]
});