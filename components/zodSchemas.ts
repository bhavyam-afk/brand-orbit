

import { z } from 'zod';

export const influencerLoginSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address.' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const brandLoginSchema = z.object({
    email: z.string().email({ message: 'Enter a valid business email.' }).refine(
        (val: string) => val.endsWith('@gmail.com') === false && val.includes('.'),
        { message: 'Please use a business email (not @gmail.com)' }
    ),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const influencerSignupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email({ message: 'Enter a valid email address.' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const brandSignupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email({ message: 'Enter a valid business email.' }).refine(
        (val: string) => val.endsWith('@gmail.com') === false && val.includes('.'),
        { message: 'Please use a business email (not @gmail.com)' }
    ),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
